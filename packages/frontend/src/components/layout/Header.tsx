import { Logo } from '../ascii/Logo';

interface HeaderProps { title?: string; }

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-[#233D4D] border-b border-[#FE7F2D]/20 px-6 py-4 flex items-center gap-4">
      <Logo animate={false} />
      {title && <h1 className="text-lg font-bold text-white">{title}</h1>}
    </header>
  );
}