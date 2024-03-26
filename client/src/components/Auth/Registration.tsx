import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useRegisterUserMutation, useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { TRegisterUser } from 'librechat-data-provider';
import { GoogleIcon, FacebookIcon, OpenIDIcon, GithubIcon, DiscordIcon } from '~/components';
import { ThemeSelector } from '~/components/ui';
import SocialButton from './SocialButton';
import { useLocalize } from '~/hooks';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { data: startupConfig } = useGetStartupConfig();
  const localize = useLocalize();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterUser>({ mode: 'onChange' });

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const registerUser = useRegisterUserMutation();
  const password = watch('password');

  const onRegisterUserFormSubmit = async (data: TRegisterUser) => {
    try {
      await registerUser.mutateAsync(data);
      navigate('/c/new');
    } catch (error) {
      setError(true);
      //@ts-ignore - error is of type unknown
      if (error.response?.data?.message) {
        //@ts-ignore - error is of type unknown
        setErrorMessage(error.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (startupConfig?.registrationEnabled === false) {
      navigate('/login');
    }
  }, [startupConfig, navigate]);

  if (!startupConfig) {
    return null;
  }

  const socialLogins = startupConfig.socialLogins ?? [];

  const renderInput = (id: string, label: string, type: string, validation: object) => (
    <div className="mb-2">
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={id}
          aria-label={localize(label)}
          {...register(
            id as 'name' | 'email' | 'username' | 'password' | 'confirm_password',
            validation,
          )}
          aria-invalid={!!errors[id]}
          className="webkit-dark-styles peer block w-full appearance-none rounded-md border border-gray-300 bg-white px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-green-500"
          placeholder=" "
          data-testid={id}
        ></input>
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-500 dark:text-gray-200"
        >
          {localize(label)}
        </label>
      </div>
      {errors[id] && (
        <span role="alert" className="mt-1 text-sm text-black dark:text-white">
          {String(errors[id]?.message) ?? ''}
        </span>
      )}
    </div>
  );

  const providerComponents = {
    discord: (
      <SocialButton
        key="discord"
        enabled={startupConfig.discordLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="discord"
        Icon={DiscordIcon}
        label={localize('com_auth_discord_login')}
        id="discord"
      />
    ),
    facebook: (
      <SocialButton
        key="facebook"
        enabled={startupConfig.facebookLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="facebook"
        Icon={FacebookIcon}
        label={localize('com_auth_facebook_login')}
        id="facebook"
      />
    ),
    github: (
      <SocialButton
        key="github"
        enabled={startupConfig.githubLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="github"
        Icon={GithubIcon}
        label={localize('com_auth_github_login')}
        id="github"
      />
    ),
    google: (
      <SocialButton
        key="google"
        enabled={startupConfig.googleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={GoogleIcon}
        label={localize('com_auth_google_login')}
        id="google"
      />
    ),
    openid: (
      <SocialButton
        key="openid"
        enabled={startupConfig.openidLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="openid"
        Icon={() =>
          startupConfig.openidImageUrl ? (
            <img src={startupConfig.openidImageUrl} alt="OpenID Logo" className="h-5 w-5" />
          ) : (
            <OpenIDIcon />
          )
        }
        label={startupConfig.openidLabel}
        id="openid"
      />
    ),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white pt-6 dark:bg-gray-900 sm:pt-0">
      <div className="absolute bottom-0 left-0 m-4">
        <ThemeSelector />
      </div>
      <div className="mt-6 w-authPageWidth overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
        <div className="flex justify-center bg-white pt-15 dark:bg-gray-900 sm:pt-0">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 600.000000 400.000000"
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
        </div>
        <h1
          className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
          style={{ userSelect: 'none' }}
        >
          {localize('com_auth_create_account')}
        </h1>
        {error && (
          <div
            className="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:bg-gray-900 dark:text-red-500"
            role="alert"
            data-testid="registration-error"
          >
            {localize('com_auth_error_create')} {errorMessage}
          </div>
        )}
        <form
          className="mt-6"
          aria-label="Registration form"
          method="POST"
          onSubmit={handleSubmit(onRegisterUserFormSubmit)}
        >
          {renderInput('name', 'com_auth_full_name', 'text', {
            required: localize('com_auth_name_required'),
            minLength: {
              value: 3,
              message: localize('com_auth_name_min_length'),
            },
            maxLength: {
              value: 80,
              message: localize('com_auth_name_max_length'),
            },
          })}
          {renderInput('username', 'com_auth_username', 'text', {
            minLength: {
              value: 2,
              message: localize('com_auth_username_min_length'),
            },
            maxLength: {
              value: 80,
              message: localize('com_auth_username_max_length'),
            },
          })}
          {renderInput('email', 'com_auth_email', 'email', {
            required: localize('com_auth_email_required'),
            minLength: {
              value: 1,
              message: localize('com_auth_email_min_length'),
            },
            maxLength: {
              value: 120,
              message: localize('com_auth_email_max_length'),
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: localize('com_auth_email_pattern'),
            },
          })}
          {renderInput('password', 'com_auth_password', 'password', {
            required: localize('com_auth_password_required'),
            minLength: {
              value: 8,
              message: localize('com_auth_password_min_length'),
            },
            maxLength: {
              value: 128,
              message: localize('com_auth_password_max_length'),
            },
          })}
          {renderInput('confirm_password', 'com_auth_password_confirm', 'password', {
            validate: (value) => value === password || localize('com_auth_password_not_match'),
          })}
          <div className="mt-6">
            <button
              disabled={Object.keys(errors).length > 0}
              type="submit"
              aria-label="Submit registration"
              className="w-full transform rounded-md bg-green-500 px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-green-600 focus:outline-none disabled:cursor-not-allowed disabled:hover:bg-green-500"
            >
              {localize('com_auth_continue')}
            </button>
          </div>
        </form>
        <p className="my-4 text-center text-sm font-light text-gray-700 dark:text-white">
          {localize('com_auth_already_have_account')}{' '}
          <a href="/login" aria-label="Login" className="p-1 font-medium text-green-500">
            {localize('com_auth_login')}
          </a>
        </p>
        {startupConfig.socialLoginEnabled && (
          <>
            {startupConfig.emailLoginEnabled && (
              <>
                <div className="relative mt-6 flex w-full items-center justify-center border border-t uppercase">
                  <div className="absolute bg-white px-3 text-xs text-black dark:bg-gray-900 dark:text-white">
                    Or
                  </div>
                </div>
                <div className="mt-8" />
              </>
            )}
            <div className="mt-2">
              {socialLogins.map((provider) => providerComponents[provider] || null)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
