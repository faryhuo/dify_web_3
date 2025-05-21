'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import Sender from './sender'
export type IChatProps = {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  onStop?: () => void
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  onStop,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e
    setQuery(value)
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])



  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.onerror = e => reject(e)
      reader.readAsText(file)
    })
  }

  const handleSend = async () => {
    // Validate input
    if (!valid() || (checkCanSend && !checkCanSend()))
      return

    let query_str = query

    // Handle file upload if present
    if (files.length > 0) {
      try {
        const fileContents = await Promise.all(
          files.map(async (file) => {
            const originFileObj = file.originFileObj;
            const content = await readFileContent(originFileObj);
            return `\`\`\`user_upload_file_${originFileObj.name}\n${content}\n\`\`\``;
          })
        );
        query_str = `${fileContents.join('\n\n\n')}\n\n\n${query_str}`;
      }
      catch (error) {
        console.error('Error reading files:', error);
      }
    }
    onSend(query_str, [])

    // Clear form if no pending local file uploads
    const hasPendingUploads = files.some(
      item => item.type === TransferMethod.local_file && !item.upload_file_id,
    )

    if (!hasPendingUploads) {
      if (files.length)
        setFiles([])
      if (!isResponding)
        setQuery('')
    }
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat List */}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isResponding={isResponding && isLast}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
            />
          )
        })}
      </div>
      {
        !isHideSendInput && (
          <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0')}>
            {isResponding && (
              <div className="flex justify-center mb-2" style={{
                position: 'fixed',
                bottom: '100px',
                left: '45%',
              }}>
                <button
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                  onClick={onStop}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                  </svg>
                  {t('common.operation.stop')}
                </button>
              </div>
            )}
            <Sender
              text={query}
              onTextChange={handleContentChange}
              onSend={handleSend}
              loading={isResponding}
              onFileChange={setFiles}
              visionConfig={visionConfig}
              files={files}
            />
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
