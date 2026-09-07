// shadcn Imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useApp } from '@/context/appContext'

// Context Import

// lucide-react Imports
import {
  WalletCards,
  Video,
  Users,
  FolderClosed,
  LayoutDashboard,
  MessageSquare,
  User,
} from 'lucide-react'

// Menu Tabs
const links = [
  {
    id: 1,
    link: 'Dashboard',
    linkAddress: '#',
    icon: LayoutDashboard,
  },
  {
    id: 2,
    link: 'Projects',
    linkAddress: '#',
    icon: FolderClosed,
  },
  {
    id: 3,
    link: 'Messages',
    linkAddress: '#',
    icon: MessageSquare,
  },
  {
    id: 4,
    link: 'Interviews',
    linkAddress: '#',
    icon: Video,
  },
  {
    id: 5,
    link: 'Team',
    linkAddress: '#',
    icon: Users,
  },
  {
    id: 6,
    link: 'Expenses',
    linkAddress: '#',
    icon: WalletCards,
  },
]

export function CompanyAppSidebar() {
  const { profile, updateDashboardContent, activeLink } = useApp()

  function handleClick(value: number) {
    updateDashboardContent(value)
  }

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
            <SidebarMenu className="sidebarMenu">
              {links.map(link => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className={`${activeLink === link.id && 'bg-[#F8F6FE] text-primary'} sidebarMenuButton-menu`}
                  >
                    <a
                      href={link.linkAddress}
                      onClick={() => handleClick(link.id)}
                      className="sidebarMenuButton-menu-item m-1"
                    >
                      <span className="sidebarMenuButton-menu-item-content">
                        <link.icon strokeWidth={1.75} width={20} height={20} />
                        <span className="sidebarMenuButton-menu-item-content-title font-semibold">
                          {link.link}
                        </span>
                      </span>
                    </a>
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
