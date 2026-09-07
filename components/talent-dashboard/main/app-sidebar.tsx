// shadcn Imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useApp } from '@/context/appContext'

// Context Import

// lucide-react Imports
import {
  BadgeCheck,
  Brain,
  Calendar,
  ChartLine,
  DollarSign,
  FileText,
  LayoutDashboard,
  Link,
  MessageSquare,
  User,
  Shield,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

// Menu Tabs
const links = [
  {
    id: 1,
    link: 'Dashboard',
    linkAddress: '/talent/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 2,
    link: 'Projects',
    linkAddress: '/talent/projects',
    icon: FileText,
  },
  {
    id: 3,
    link: 'Messages',
    linkAddress: '/talent/messages',
    icon: MessageSquare,
  },
  {
    id: 4,
    link: 'Interviews',
    linkAddress: '/talent/interviews',
    icon: Calendar,
  },
  {
    id: 5,
    link: 'Earnings',
    linkAddress: '/talent/earnings',
    icon: DollarSign,
  },
  {
    id: 6,
    link: 'Assessment',
    linkAddress: '/talent/assessment',
    icon: Brain,
  },
  {
    id: 7,
    link: 'Verification',
    linkAddress: '/talent/verification',
    icon: Shield,
  },
]

export function AppSidebar() {
  const { profile, updateDashboardContent } = useApp()
  const pathname = usePathname()
  const router = useRouter()

  function handleClick(value: number) {
    updateDashboardContent(value)
  }

  const pathSegments = pathname.split('/').filter(Boolean) // Remove empty segments
  const currentPath = pathSegments.length >= 2 ? `/${pathSegments[0]}/${pathSegments[1]}` : ''

  return (
    <Sidebar variant="sidebar">
      <SidebarContent className="sidebarContent gap-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="sidebarMenu">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-fit sidebarMenuButton-user">
                  <div className="sidebarMenuButton-user-item">
                    <div className="sidebarMenuButton-user-item-img">
                      <User className="sidebarMenuButton-user-item-icon" />
                    </div>
                    <div className="sidebarMenuButton-user-item-content">
                      <span className="sidebarMenuButton-user-item-usertype">
                        {profile?.userType
                          .split('')
                          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
                          .join('')}
                      </span>
                      <span className="sidebarMenuButton-user-item-username">
                        {`${profile?.firstName} ${profile?.lastName}`}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* <SidebarGroupLabel className="sidebarGroupLabel">Menu</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="sidebarMenu gap-2">
              {links.map(link => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className={`cursor-pointer ${currentPath === link.linkAddress && 'bg-[#F1EDFD] text-[#4F32A4]'} sidebarMenuButton-menu`}
                    onClick={() => {
                      router.push(link.linkAddress)
                      handleClick(link.id)
                    }}
                  >
                    <span className="sidebarMenuButton-menu-item-content">
                      <link.icon strokeWidth={1.75} width={20} height={20} />
                      <span className="sidebarMenuButton-menu-item-content-title">{link.link}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
