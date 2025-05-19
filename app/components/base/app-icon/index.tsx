import type { FC } from 'react'
import Image from 'next/image'
import icon from './axisoft.gif'
export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  return (
    <span
    >
      <Image src={icon} alt="app icon" width={80} height={25} />
    </span>
  )
}

export default AppIcon
