export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          VakilSahayak
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
          Workflow system for advocates. Case tracking, document management,
          and daily updates — delivered on WhatsApp.
        </p>

        <div className="mt-12 grid gap-6 w-full max-w-sm text-left">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">System Status</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              API endpoint active. WhatsApp integration live.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Webhook</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              POST /api/webhooks/twilio
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Health Check</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              GET /api/health
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
