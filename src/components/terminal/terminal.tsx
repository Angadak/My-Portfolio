'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { complete, runCommand } from '@/lib/terminal/commands';
import type { SiteIndex } from '@/lib/site';
import { CloseIcon } from '@/components/ui/icons';

type Line = { kind: 'in' | 'out'; text: string };

const PROMPT = 'angad@dev:~$';

export function Terminal({ ctx, onClose }: { ctx: SiteIndex; onClose: () => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: "Type 'help' to see what I can do." }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const out = outputRef.current;
    if (out) out.scrollTop = out.scrollHeight;
  }, [lines]);

  function submit() {
    const input = value;
    setValue('');
    setCursor(null);
    if (input.trim()) setHistory((h) => [...h, input]);
    const result = runCommand(input, ctx);
    if (result.effect?.type === 'clear') {
      setLines([]);
      return;
    }
    setLines((current) => [...current, { kind: 'in', text: input }, ...result.lines.map((text) => ({ kind: 'out' as const, text }))]);
    if (result.effect?.type === 'navigate') {
      router.push(result.effect.href);
      onClose();
    } else if (result.effect?.type === 'download') {
      const link = document.createElement('a');
      link.href = result.effect.href;
      link.download = '';
      link.click();
    } else if (result.effect?.type === 'close') {
      onClose();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue('');
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const matches = complete(value);
      if (matches.length === 1) setValue(matches[0]);
      else if (matches.length > 1) setLines((current) => [...current, { kind: 'out', text: matches.join('   ') }]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0f0f14] font-mono text-sm text-[#e9e6ef] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-[#a39fb8]">angad@dev: ~</span>
          <button type="button" onClick={onClose} aria-label="Close terminal" className="rounded p-1 text-[#a39fb8] hover:text-white">
            <CloseIcon className="size-4" />
          </button>
        </div>
        <div ref={outputRef} aria-live="polite" className="max-h-[50vh] min-h-48 overflow-y-auto p-4">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.kind === 'in' ? (
                <>
                  <span className="text-[#c4b5fd]">{PROMPT}</span> {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <span aria-hidden className="text-[#c4b5fd]">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-[#e9e6ef] outline-none"
          />
        </label>
      </div>
    </div>
  );
}
