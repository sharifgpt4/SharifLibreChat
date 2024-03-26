import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from 'librechat-data-provider/react-query';
import type { TResetPassword } from 'librechat-data-provider';
import { ThemeSelector } from '~/components/ui';
import { useLocalize } from '~/hooks';

function ResetPassword() {
  const localize = useLocalize();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TResetPassword>();
  const resetPassword = useResetPasswordMutation();
  const [resetError, setResetError] = useState<boolean>(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = (data: TResetPassword) => {
    resetPassword.mutate(data, {
      onError: () => {
        setResetError(true);
      },
    });
  };

  if (resetPassword.isSuccess) {
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
          <h1 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white">
            {localize('com_auth_reset_password_success')}
          </h1>
          <div
            className="relative mb-8 mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-center text-green-700 dark:bg-gray-900 dark:text-white"
            role="alert"
          >
            {localize('com_auth_login_with_new_password')}
          </div>
          <button
            onClick={() => navigate('/login')}
            aria-label={localize('com_auth_sign_in')}
            className="w-full transform rounded-md bg-green-500 px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
          >
            {localize('com_auth_continue')}
          </button>
        </div>
      </div>
    );
  } else {
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
          <h1 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white">
            {localize('com_auth_reset_password')}
          </h1>
          {resetError && (
            <div
              className="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:bg-gray-900 dark:text-red-500"
              role="alert"
            >
              {localize('com_auth_error_invalid_reset_token')}{' '}
              <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
                {localize('com_auth_click_here')}
              </a>{' '}
              {localize('com_auth_to_try_again')}
            </div>
          )}
          <form
            className="mt-6"
            aria-label="Password reset form"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-2">
              <div className="relative">
                <input
                  type="hidden"
                  id="token"
                  // @ts-ignore - Type 'string | null' is not assignable to type 'string | number | readonly string[] | undefined'
                  value={params.get('token')}
                  {...register('token', { required: 'Unable to process: No valid reset token' })}
                />
                <input
                  type="hidden"
                  id="userId"
                  // @ts-ignore - Type 'string | null' is not assignable to type 'string | number | readonly string[] | undefined'
                  value={params.get('userId')}
                  {...register('userId', { required: 'Unable to process: No valid user id' })}
                />
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  aria-label={localize('com_auth_password')}
                  {...register('password', {
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
                  aria-invalid={!!errors.password}
                  className="peer block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-green-500"
                  placeholder=" "
                ></input>
                <label
                  htmlFor="password"
                  className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-500 dark:text-gray-200"
                >
                  {localize('com_auth_password')}
                </label>
              </div>

              {errors.password && (
                <span role="alert" className="mt-1 text-sm text-black dark:text-white">
                  {/* @ts-ignore not sure why */}
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="mb-2">
              <div className="relative">
                <input
                  type="password"
                  id="confirm_password"
                  aria-label={localize('com_auth_password_confirm')}
                  // uncomment to prevent pasting in confirm field
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  {...register('confirm_password', {
                    validate: (value) =>
                      value === password || localize('com_auth_password_not_match'),
                  })}
                  aria-invalid={!!errors.confirm_password}
                  className="peer block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-green-500"
                  placeholder=" "
                ></input>
                <label
                  htmlFor="confirm_password"
                  className="pointer-events-none absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-500 dark:text-gray-200"
                >
                  {localize('com_auth_password_confirm')}
                </label>
              </div>
              {errors.confirm_password && (
                <span role="alert" className="mt-1 text-sm text-black dark:text-white">
                  {/* @ts-ignore not sure why */}
                  {errors.confirm_password.message}
                </span>
              )}
              {errors.token && (
                <span role="alert" className="mt-1 text-sm text-black dark:text-white">
                  {/* @ts-ignore not sure why */}
                  {errors.token.message}
                </span>
              )}
              {errors.userId && (
                <span role="alert" className="mt-1 text-sm text-black dark:text-white">
                  {/* @ts-ignore not sure why */}
                  {errors.userId.message}
                </span>
              )}
            </div>
            <div className="mt-6">
              <button
                disabled={!!errors.password || !!errors.confirm_password}
                type="submit"
                aria-label={localize('com_auth_submit_registration')}
                className="w-full transform rounded-md bg-green-500 px-4 py-3 tracking-wide text-white transition-all duration-300 hover:bg-green-550 focus:bg-green-550 focus:outline-none"
              >
                {localize('com_auth_continue')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
