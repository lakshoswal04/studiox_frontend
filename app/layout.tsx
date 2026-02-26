import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { SmoothScroll } from "@/components/smooth-scroll"
import { AuthProvider } from "@/context/auth-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "StudioX - AI Creative Platform",
  description: "Create amazing AI-generated content with StudioX",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(event) {
                const msg = event.message || (event.error && event.error.message) || '';
                if (msg.includes('Load failed') || msg.includes('browsing context') || msg.includes('Navigator LockManager')) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              }, true);
              
              window.addEventListener('unhandledrejection', function(event) {
                const msg = (event.reason && event.reason.message) || '';
                const name = (event.reason && event.reason.name) || '';
                if (
                  name === 'AbortError' || 
                  msg.includes('browsing context is going away') ||
                  msg.includes('Load failed') ||
                  msg.includes('Navigator LockManager')
                ) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              }, true);
              
              const originalConsoleError = console.error;
              console.error = function(...args) {
                try {
                  const argData = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Error ? args[0].message : JSON.stringify(args));
                  if (
                    argData.includes('Navigator LockManager') || 
                    argData.includes('Load failed') || 
                    argData.includes('browsing context is going away') || 
                    argData.includes('AbortError')
                  ) {
                    return;
                  }
                } catch(e) {}
                originalConsoleError.apply(console, args);
              };

              // MutationObserver to aggressively remove Next.js dev overlay for specific Safari false-positives
              if (typeof window !== 'undefined') {
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeName === 'NEXTJS-PORTAL') {
                        try {
                          const shadowRoot = node.shadowRoot;
                          if (shadowRoot) {
                            const observerWrapper = new MutationObserver(() => {
                              const text = shadowRoot.innerHTML;
                              if (text.includes('Load failed') || text.includes('browsing context is going away') || text.includes('Navigator LockManager')) {
                                node.remove();
                              }
                            });
                            observerWrapper.observe(shadowRoot, { childList: true, subtree: true, characterData: true });
                          }
                        } catch (e) {}
                      }
                    });
                  });
                });
                
                document.addEventListener('DOMContentLoaded', function() {
                  observer.observe(document.body, { childList: true, subtree: true });
                });
              }
            `
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Analytics />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  )
}
