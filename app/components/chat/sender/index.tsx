import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, Badge, Button, Flex, type GetProp, type GetRef, Typography } from 'antd';
import React from 'react';

const Demo: React.FC<{
    text?: string;
    onTextChange?: (text: string) => void;
    onSend?: () => void;
    visionConfig?: any;
    files?: any[];
    loading?: boolean;
    onFileChange?: (files: any[]) => void;
}> = ({
    text,
    onTextChange,
    onSend,
    visionConfig,
    files,
    onFileChange,
    loading
}) => {
        const [open, setOpen] = React.useState(false);
        const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>(files || []);

        const senderRef = React.useRef<GetRef<typeof Sender>>(null);

        React.useEffect(() => {
            if (files) {
                setItems(files);
            }
        }, [files]);

        const senderHeader = (
            <Sender.Header
                title="Attachments"
                open={open}
                onOpenChange={setOpen}
                styles={{
                    content: {
                        padding: 0,
                    },
                }}
            >
                <Attachments
                    maxCount={1}
                    beforeUpload={() => false}
                    items={items}
                    onChange={({ fileList }) => {
                        setItems(fileList);
                        onFileChange?.(fileList);
                    }}
                    placeholder={(type) =>
                        type === 'drop'
                            ? {
                                title: 'Drop file here',
                            }
                            : {
                                icon: <CloudUploadOutlined />,
                                title: 'Upload files',
                                description: 'Click or drag files to this area to upload',
                            }
                    }
                    getDropContainer={() => senderRef.current?.nativeElement}
                />
            </Sender.Header>
        );

        return (
            <Flex align="flex-end">
                <Sender
                    loading={loading}
                    ref={senderRef}
                    header={senderHeader}
                    prefix={
                        <Badge dot={items.length > 0 && !open}>
                            <Button onClick={() => setOpen(!open)} icon={<LinkOutlined />} />
                        </Badge>
                    }
                    value={text}
                    onChange={(newText) => {
                        onTextChange?.(newText);
                    }}
                    onSubmit={() => {
                        onSend?.();
                        setOpen(false);
                    }}
                />
            </Flex>
        );
    };

export default Demo; 