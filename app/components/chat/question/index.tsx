'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  const userName = ''
  const [showFileContent, setShowFileContent] = useState(false)

  const getFileContent = (content: string) => {
    const match = content.match(/```user_upload_file_(.*?)\n([\s\S]*?)\n```/)
    if (match) {
      return {
        fileName: match[1],
        content: match[2],
      }
    }
    return null
  }

  const fileContentObj = getFileContent(content)
  const fileContent = fileContentObj ? fileContentObj.content : null
  const fileName = fileContentObj ? fileContentObj.fileName : ''
  const displayContent = fileContentObj ? content.replace(/```user_upload_file_.*?\n[\s\S]*?\n```\n\n\n/, '') : content

  // Simple Modal component
  const Modal: FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
    if (!open)
      return null
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#222',
            color: '#fff',
            padding: '24px',
            borderRadius: '8px',
            minWidth: '300px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
            aria-label="Close"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-start justify-end' key={id}>
      <div>
        <div className={`${s.question} relative text-sm text-gray-900`}>
          <div
            className={'mr-2 py-3 px-4 bg-blue-500 rounded-tl-2xl rounded-b-2xl'}
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            {fileContent && (
              <div className='mb-2'>
                <button
                  className='flex items-center text-white hover:text-gray-200'
                  onClick={() => setShowFileContent(true)}
                >
                  <svg className='w-5 h-5 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z' />
                  </svg>
                  <span className="text-black">{fileName ? `${fileName}` : ''}</span>
                </button>
                <Modal open={showFileContent} onClose={() => setShowFileContent(false)}>
                  <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '1.1em' }}>{fileName}</div>
                  <pre className='mt-2 p-2 bg-gray-700 text-white rounded' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {fileContent}
                  </pre>
                </Modal>
              </div>
            )}
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '800px' }}>
              {displayContent}
            </pre>
          </div>
        </div>
      </div>
      {useCurrentUserAvatar
        ? (
          <div className='w-10 h-10 shrink-0 leading-10 text-center mr-2 rounded-full bg-primary-600 text-white'>
            {userName?.[0].toLocaleUpperCase()}
          </div>
        )
        : (
          <div className={`${s.questionIcon} w-10 h-10 shrink-0 `}></div>
        )}
    </div>
  )
}

export default React.memo(Question)
