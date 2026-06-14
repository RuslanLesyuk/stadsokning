"use client"

type Props = {
  verified?: boolean
}

export default function BankIdVerifyButton({ verified = false }: Props) {
  if (verified) {
    return (
      <div className="space-y-2">
        <div className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
          ✓ Verified with BankID
        </div>

        <p className="text-xs leading-5 text-emerald-700">
          Your profile has been verified with BankID.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <a
        href="/api/bankid/start"
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.97]"
      >
        Verify with BankID
      </a>

      <p className="text-xs leading-5 text-slate-500">
        BankID verification is currently connected in test mode.
      </p>
    </div>
  )
}