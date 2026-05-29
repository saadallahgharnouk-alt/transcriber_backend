import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react'
import Dropzone from './Dropzone'
import LanguageSelector from './LanguageSelector'
import ProcessingState from './ProcessingState'
import TranscriptionResult from './TranscriptionResult'
import { transcribeFile } from '../lib/api'

export default function UploadSection() {
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState('auto')
  const [stage, setStage] = useState('idle') // idle | upload | process | finalize | done | error
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const busy =
    stage === 'upload' || stage === 'process' || stage === 'finalize'

  const handleSubmit = async () => {
    if (!file) return
    setError(null)
    setResult(null)
    setStage('upload')
    setProgress(0)

    try {
      const data = await transcribeFile(file, language, (p) => {
        setProgress(p)
        if (p >= 99) setStage('process')
      })
      setStage('finalize')
      // little flourish before showing result
      setTimeout(() => {
        setResult(data)
        setStage('done')
      }, 350)
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.error ||
        e?.message ||
        'Something went wrong while transcribing.'
      setError(msg)
      setStage('error')
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setStage('idle')
    setProgress(0)
  }

  return (
    <section id="upload" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="chip mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-soft" />
            Step 1 — Upload
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Drop your file in. We&apos;ll{' '}
            <span className="text-gradient-mono">do the rest.</span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {stage === 'done' && result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TranscriptionResult
                result={result}
                file={file}
                onReset={reset}
              />
            </motion.div>
          ) : busy ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProcessingState stage={stage} progress={progress} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong rounded-3xl p-5 sm:p-7 noise relative"
            >
              <Dropzone file={file} onFile={setFile} />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">
                    Language
                  </h4>
                  <span className="text-xs text-ink-200/60">
                    Pick a hint or let us auto-detect
                  </span>
                </div>
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  disabled={busy}
                />
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <p className="text-xs text-ink-200/60">
                  Your file is processed and discarded. We don&apos;t store it.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!file || busy}
                  className="btn-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  Transcribe now
                </button>
              </div>

              <AnimatePresence>
                {error && stage === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-5 flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-400/30 p-4"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-rose-200">
                        Transcription failed
                      </p>
                      <p className="text-sm text-rose-300/80 mt-0.5">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="btn-ghost !py-1.5 !px-3 text-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
