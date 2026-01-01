import Connections from '@renderer/pages/connections'
import DNS from '@renderer/pages/dns'
import Logs from '@renderer/pages/logs'
import Mihomo from '@renderer/pages/mihomo'
import Override from '@renderer/pages/override'
import Profiles from '@renderer/pages/profiles'
import Proxies from '@renderer/pages/proxies'
import Resources from '@renderer/pages/resources'
import Rules from '@renderer/pages/rules'
import Settings from '@renderer/pages/settings'
import Sniffer from '@renderer/pages/sniffer'
import SubStore from '@renderer/pages/substore'
import Sysproxy from '@renderer/pages/syspeoxy'
import Tun from '@renderer/pages/tun'
import { Navigate } from 'react-router-dom'
const routes = [
  {
    path: '/mihomo',
    element: <Mihomo />,
  },
  {
    path: '/sysproxy',
    element: <Sysproxy />,
  },
  {
    path: '/tun',
    element: <Tun />,
  },
  {
    path: '/proxies',
    element: <Proxies />,
  },
  {
    path: '/rules',
    element: <Rules />,
  },
  {
    path: '/resources',
    element: <Resources />,
  },
  {
    path: '/dns',
    element: <DNS />,
  },
  {
    path: '/sniffer',
    element: <Sniffer />,
  },
  {
    path: '/logs',
    element: <Logs />,
  },
  {
    path: '/connections',
    element: <Connections />,
  },
  {
    path: '/override',
    element: <Override />,
  },
  {
    path: '/profiles',
    element: <Profiles />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/substore',
    element: <SubStore />,
  },
  {
    path: '/',
    element: <Navigate to='/proxies' />,
  },
]

export default routes
