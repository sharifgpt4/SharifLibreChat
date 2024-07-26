import { useLocation } from 'react-router-dom';
import { Fragment, useState, memo } from 'react';
import { Download, FileText } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { TConversation } from 'librechat-data-provider';
import FilesView from '~/components/Chat/Input/Files/FilesView';
import { useAuthContext } from '~/hooks/AuthContext';
import useAvatar from '~/hooks/Messages/useAvatar';
import { ExportModal } from './ExportConversation';
import { LinkIcon, GearIcon } from '~/components';
import { UserIcon } from '~/components/svg';
import { useLocalize } from '~/hooks';
import Settings from './Settings';
import NavLink from './NavLink';
import Logout from './Logout';
import { cn } from '~/utils/';
import store from '~/store';
import Subscriptions from './Subscriptions';
function NavLinks() {
  const localize = useLocalize();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const [showExports, setShowExports] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFiles, setShowFiles] = useRecoilState(store.showFiles);
  const [showPricing, setShowPricing] = useState(false);

  const activeConvo = useRecoilValue(store.conversationByIndex(0));
  const globalConvo = useRecoilValue(store.conversation) ?? ({} as TConversation);

  const avatarSrc = useAvatar(user);

  let conversation: TConversation | null | undefined;
  if (location.state?.from?.pathname.includes('/chat')) {
    conversation = globalConvo;
  } else {
    conversation = activeConvo;
  }

  const exportable =
    conversation &&
    conversation.conversationId &&
    conversation.conversationId !== 'new' &&
    conversation.conversationId !== 'search';

  const clickHandler = () => {
    if (exportable) {
      setShowExports(true);
    }
  };
  console.log(balanceQuery.data);

  return (
    <>
      <Menu as="div" className="group relative">
        {({ open }) => (
          <>
            {startupConfig?.checkBalance && balanceQuery.data && (
              <div className="m-1 ml-3 whitespace-nowrap text-left text-sm text-gray-100">
              </div>
            )}

            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    className={cn(
                      'duration-350 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors',
                      'hover:bg-[#202123]', // Background color on hover
                      open ? 'bg-[#202123]' : 'bg-transparent', // Conditional background color based on open state
                      'text-sm mb-1', // Text size and bottom margin
                    )}
                    data-testid="nav-user"
                    onClick={() => setShowPricing(true)}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-token-border-light">
                      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="600.000000pt" height="400.000000pt" viewBox="0 0 600.000000 400.000000"
                        preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)"
                          fill="#fff" stroke="none">
                          <path d="M2655 3289 c-152 -20 -345 -95 -480 -184 -78 -52 -193 -162 -258
-247 -103 -135 -198 -360 -214 -506 -3 -29 -10 -55 -14 -58 -13 -7 -11 -221 1
-229 6 -3 10 -21 10 -38 0 -48 46 -209 84 -298 113 -261 345 -485 607 -587
167 -64 238 -77 429 -76 144 1 178 4 268 27 111 29 222 79 222 101 0 14 -103
116 -118 116 -5 0 -35 -9 -67 -20 -86 -29 -248 -60 -319 -60 -33 0 -97 7 -141
15 -212 40 -376 125 -520 270 -151 150 -234 316 -269 537 -20 122 -20 162 -1
263 44 231 121 382 270 530 154 154 324 239 549 271 122 18 224 11 364 -27
261 -69 490 -262 607 -512 51 -106 94 -293 95 -402 0 -66 -25 -204 -51 -285
-44 -134 -137 -290 -173 -290 -14 0 -89 68 -227 207 -187 188 -208 214 -228
268 -31 83 -26 160 17 247 18 36 32 70 32 75 0 13 -89 103 -102 103 -6 0 -40
-15 -77 -32 -58 -29 -76 -33 -146 -33 -71 0 -86 3 -139 33 -33 17 -65 32 -72
32 -15 0 -104 -87 -104 -102 0 -6 15 -40 33 -77 27 -56 32 -76 32 -141 0 -65
-5 -85 -32 -141 -18 -37 -33 -71 -33 -76 0 -14 91 -103 105 -103 7 0 41 15 75
33 56 28 72 32 144 32 65 0 90 -5 126 -24 30 -15 173 -151 418 -395 424 -422
428 -427 420 -545 -4 -50 -12 -80 -33 -115 l-28 -47 49 -50 c26 -27 56 -49 65
-49 9 0 41 11 71 25 71 33 145 33 216 0 30 -14 62 -25 72 -25 9 0 38 22 63 49
l47 50 -30 63 c-38 79 -39 140 -5 223 14 33 25 67 25 76 0 18 -78 99 -96 99
-7 0 -36 -11 -66 -25 -36 -17 -70 -25 -108 -25 -97 0 -122 13 -230 116 -55 53
-102 105 -106 116 -4 13 6 37 32 76 136 205 195 372 209 592 16 254 -50 490
-199 714 -161 241 -457 422 -761 466 -81 11 -224 11 -310 -1z m223 -1106 l-3
-68 -65 0 -65 0 -3 54 c-5 79 -2 81 73 81 l66 0 -3 -67z m1180 -1200 c3 -38 0
-43 -21 -48 -14 -4 -36 -5 -48 -3 -26 3 -35 32 -24 75 5 21 10 24 48 21 42 -3
42 -3 45 -45z"/>
                        </g>
                      </svg>

                    </span>
                    <div className="flex flex-col">
                      <div
                        className="mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left font-bold text-white"
                        style={{ marginTop: '-4px', marginLeft: '2px' }}

                      >
                        {balanceQuery.data?.hasSubscription ? `${balanceQuery.data?.subscriptionDetails.subscription.name} ` : 'Subscribe to Qstar' }

                      </div>
                      

                      <span className="text-xs text-token-text-tertiary">{balanceQuery.data?.hasSubscription ? `` : 'Use AI, GPT-4, DALL-E and more' }</span>
                    </div>
                  </Menu.Button>
                  {showPricing && <Subscriptions open={showPricing} onOpenChange={setShowPricing} />}

                  {/* Menu Items */}
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* Menu items here */}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <Menu.Button
              className={cn(
                'group-ui-open:bg-gray-100 dark:group-ui-open:bg-gray-700 duration-350 mt-text-sm mb-1 flex w-full items-center gap-3 text-sm rounded-md px-3 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
                open ? 'bg-gray-100 dark:bg-gray-700' : '',
              )}
              data-testid="nav-user"
            >
              <div className="-ml-0.9 -mt-0.8 h-5 w-5 flex-shrink-0">
                <div className="relative flex">
                  {!user?.avatar && !user?.username ? (
                    <div
                      style={{
                        backgroundColor: 'rgb(121, 137, 255)',
                        width: '20px',
                        height: '20px',
                        boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
                      }}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full p-1 text-white"
                    >
                      <UserIcon />
                    </div>
                  ) : (
                    <img className="rounded-full" src={user?.avatar || avatarSrc} alt="avatar" />
                  )}
                </div>
              </div>
              <div
                className="mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left font-bold text-black dark:text-white"
                style={{ marginTop: '0', marginLeft: '0' }}
              >
                {user?.name || localize('com_nav_user')}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-110 transform"
              enterFrom="translate-y-2 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition ease-in duration-100 transform"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-2 opacity-0"
            >
              <Menu.Items className="absolute bottom-full left-0 z-20 mb-1 mt-1 w-full translate-y-0 overflow-hidden rounded-lg bg-white py-1.5 opacity-100 outline-none dark:bg-gray-800">
                <Menu.Item as="div">
                  <NavLink
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-black transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
                      exportable
                        ? 'cursor-pointer text-black dark:text-white'
                        : 'cursor-not-allowed text-black/50 dark:text-white/50',
                    )}
                    svg={() => <Download size={ 16} />}
                    text={localize('com_nav_export_conversation')}
                    clickHandler={clickHandler}
                  />
                </Menu.Item>
                <div className="my-1 h-px bg-black/20 dark:bg-white/20" role="none" />
                <Menu.Item as="div">
                  <NavLink
                    className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-black transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    svg={() => <FileText className="icon-md" />}
                    text={localize('com_nav_my_files')}
                    clickHandler={() => setShowFiles(true)}
                  />
                </Menu.Item>
                {startupConfig?.helpAndFaqURL !== '/' && (
                  <Menu.Item as="div">
                    <NavLink
                      className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-black transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      svg={() => <LinkIcon />}
                      text={localize('com_nav_help_faq')}
                      clickHandler={() => window.open('https://qstarmachine.com', '_blank')}
                    />
                  </Menu.Item>
                )}
                <Menu.Item as="div">
                  <NavLink
                    className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-black transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    svg={() => <GearIcon className="icon-md" />}
                    text={localize('com_nav_settings')}
                    clickHandler={() => setShowSettings(true)}
                  />
                </Menu.Item>
                <div className="my-1 h-px bg-black/20 bg-white/20" role="none" />
                <Menu.Item as="div">
                  <Logout />
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {showExports && (
        <ExportModal open={showExports} onOpenChange={setShowExports} conversation={conversation} />
      )}
      {showFiles && <FilesView open={showFiles} onOpenChange={setShowFiles} />}
      {showSettings && <Settings open={showSettings} onOpenChange={setShowSettings} />}
    </>
  );
}

export default memo(NavLinks);
