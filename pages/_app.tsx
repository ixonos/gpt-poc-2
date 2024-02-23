import * as React from 'react';
import Head from 'next/head';
import { MyAppProps } from 'next/app';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next';


import { Brand } from '~/common/app.config';
import { apiQuery } from '~/common/util/trpc.client';

import 'katex/dist/katex.min.css';
import '~/common/styles/CodePrism.css';
import '~/common/styles/GithubMarkdown.css';
import '~/common/styles/NProgress.css';
import '~/common/styles/app.styles.css';

import {GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";


import { ProviderBackendAndNoSSR } from '~/common/providers/ProviderBackendAndNoSSR';
import { ProviderBootstrapLogic } from '~/common/providers/ProviderBootstrapLogic';
import { ProviderSingleTab } from '~/common/providers/ProviderSingleTab';
import { ProviderSnacks } from '~/common/providers/ProviderSnacks';
import { ProviderTRPCQueryClient } from '~/common/providers/ProviderTRPCQueryClient';
import { ProviderTheming } from '~/common/providers/ProviderTheming';
import { isVercelFrontend } from '~/common/util/pwaUtils';


const MyApp = ({ Component, emotionCache, pageProps }: MyAppProps) =>
  <>

    <Head>
      <title>{Brand.Title.Common}</title>
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
    </Head>

    <GoogleOAuthProvider clientId="321179445379-ec5hduu2llaj77tbjga4qqaogtj6curu.apps.googleusercontent.com">
    <ProviderTheming emotionCache={emotionCache}>
      <ProviderSingleTab>
        <ProviderBootstrapLogic>
          <ProviderTRPCQueryClient>
            <ProviderSnacks>
              <ProviderBackendAndNoSSR>
                <Component {...pageProps} />
              </ProviderBackendAndNoSSR>
            </ProviderSnacks>
          </ProviderTRPCQueryClient>
        </ProviderBootstrapLogic>
      </ProviderSingleTab>
    </ProviderTheming>
    </GoogleOAuthProvider>

    {isVercelFrontend && <VercelAnalytics debug={false} />}
    {isVercelFrontend && <VercelSpeedInsights debug={false} sampleRate={1 / 2} />}

  </>;

// enables the React Query API invocation
export default apiQuery.withTRPC(MyApp);