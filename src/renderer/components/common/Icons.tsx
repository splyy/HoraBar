import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Base for stroke-based icons (actions, chevrons) */
function Icon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

/** Base for fill-based icons (bold/solid) */
function IconFill({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    />
  );
}

// ── Bold / Fill icons ──────────────────────────

export function IconSun(props: IconProps) {
  return (
    <IconFill {...props}>
      <g fill="currentColor">
        <path d="M18 12a6 6 0 1 1-12 0a6 6 0 0 1 12 0Z" />
        <path fillRule="evenodd" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75ZM4.399 4.399a.75.75 0 0 1 1.06 0l.393.392a.75.75 0 0 1-1.06 1.061l-.393-.393a.75.75 0 0 1 0-1.06Zm15.202 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 0 1-1.06-1.06l.393-.393a.75.75 0 0 1 1.06 0ZM1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75Zm19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75Zm-2.102 6.148a.75.75 0 0 1 1.06 0l.393.393a.75.75 0 1 1-1.06 1.06l-.393-.393a.75.75 0 0 1 0-1.06Zm-12.296 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.061 0ZM12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
      </g>
    </IconFill>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M11.25 2a.75.75 0 0 1 .75-.75c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75S1.25 17.937 1.25 12a.75.75 0 0 1 1.5 0A9.25 9.25 0 1 0 12 2.75a.75.75 0 0 1-.75-.75ZM12 8.25a.75.75 0 0 1 .75.75v3.25H16a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75ZM9.1 2.398a.75.75 0 0 1-.43.97a9.187 9.187 0 0 0-.42.173a.75.75 0 1 1-.608-1.37c.16-.072.323-.14.488-.203a.75.75 0 0 1 .97.43ZM5.648 4.24a.75.75 0 0 1-.026 1.06a9.31 9.31 0 0 0-.321.322a.75.75 0 1 1-1.087-1.035c.122-.127.246-.251.373-.373a.75.75 0 0 1 1.06.026ZM3.16 7.261a.75.75 0 0 1 .381.99c-.061.138-.12.278-.174.419a.75.75 0 0 1-1.399-.54c.063-.165.13-.327.202-.488a.75.75 0 0 1 .99-.381Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconCog(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.409 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083ZM12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9c-1.67 0-3.023 1.343-3.023 3s1.354 3 3.023 3Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconClock(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464ZM12.75 8a.75.75 0 0 0-1.5 0v4c0 .199.079.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06l-2.28-2.28V8Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm.75-13a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconX(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10ZM8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path fill="currentColor" d="m5.505 11.41l.53.53l-.53-.53ZM3 14.952h-.75H3Zm9.59 3.543l-.53-.53l.53.53ZM9.048 21v.75V21ZM11.41 5.505l-.53-.53l.53.53Zm1.831 12.34a.75.75 0 0 0 1.06-1.061l-1.06 1.06ZM7.216 9.697a.75.75 0 1 0-1.06 1.061l1.06-1.06Zm8.857 6.375a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm2.395-4.517a.75.75 0 1 0 1.064 1.056l-1.064-1.056Zm-12.433.384l5.905-5.905l-1.06-1.06l-5.905 5.904l1.06 1.06Zm0 6.025c-.85-.85-1.433-1.436-1.812-1.933c-.367-.481-.473-.79-.473-1.08h-1.5c0 .749.312 1.375.78 1.99c.455.596 1.125 1.263 1.945 2.083l1.06-1.06Zm-1.06-7.086c-.82.82-1.49 1.488-1.945 2.084c-.468.614-.78 1.24-.78 1.99h1.5c0-.29.106-.6.473-1.08c.38-.498.962-1.083 1.812-1.933l-1.06-1.06Zm7.085 7.086c-.85.85-1.435 1.433-1.933 1.813c-.48.366-.79.472-1.08.472v1.5c.75 0 1.376-.312 1.99-.78c.596-.455 1.264-1.125 2.084-1.945l-1.06-1.06Zm-7.085 1.06c.82.82 1.487 1.49 2.084 1.945c.614.468 1.24.78 1.989.78v-1.5c-.29 0-.599-.106-1.08-.473c-.497-.38-1.083-.962-1.933-1.812l-1.06 1.06Zm12.99-12.99c.85.85 1.433 1.436 1.813 1.933c.366.481.472.79.472 1.08h1.5c0-.749-.312-1.375-.78-1.99c-.455-.596-1.125-1.263-1.945-2.083l-1.06 1.06Zm1.06-1.06c-.82-.82-1.487-1.49-2.084-1.945c-.614-.468-1.24-.78-1.989-.78v1.5c.29 0 .599.106 1.08.473c.497.38 1.083.962 1.933 1.812l1.06-1.06Zm-7.085 1.06c.85-.85 1.435-1.433 1.933-1.812c.48-.367.79-.473 1.08-.473v-1.5c-.75 0-1.376.312-1.99.78c-.596.455-1.264 1.125-2.084 1.945l1.06 1.06Zm2.362 10.749L7.216 9.698l-1.06 1.061l7.085 7.085l1.06-1.06Zm.71-1.772l-2.952 2.953l1.06 1.06l2.953-2.952l-1.06-1.06Zm4.52-2.4c.661-.666 1.206-1.236 1.582-1.772c.388-.553.636-1.125.636-1.792h-1.5c0 .26-.086.534-.364.931c-.291.415-.746.9-1.418 1.577l1.064 1.056Z" />
      <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M9 21h12" />
    </svg>
  );
}

export function IconArchive(props: IconProps) {
  return (
    <svg
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077h3c.466 0 .699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883s0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077h-3c-.466 0-.699 0-.883-.076a1 1 0 0 1-.54-.541C9 12.699 9 12.466 9 12Z" />
        <path strokeLinecap="round" d="M20.5 7v6c0 3.771 0 5.657-1.172 6.828C18.157 21 16.271 21 12.5 21h-1c-3.771 0-5.657 0-6.828-1.172C3.5 18.657 3.5 16.771 3.5 13V7" />
        <path d="M2 5c0-.943 0-1.414.293-1.707C2.586 3 3.057 3 4 3h16c.943 0 1.414 0 1.707.293C22 3.586 22 4.057 22 5c0 .943 0 1.414-.293 1.707C21.414 7 20.943 7 20 7H4c-.943 0-1.414 0-1.707-.293C2 6.414 2 5.943 2 5Z" />
      </g>
    </svg>
  );
}

// ── Stroke icons (kept as-is) ──────────────────

export function IconPencil(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="M15 5l4 4" />
    </Icon>
  );
}

export function IconUnarchive(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="3" width="20" height="5" rx="2" />
      <path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8M12 12v6M9 15l3-3 3 3" />
    </Icon>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18l6-6-6-6" />
    </Icon>
  );
}

// ── New icons ──────────────────────────────────

export function IconBug(props: IconProps) {
  return (
    <svg
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M14 21.71A7 7 0 0 1 5 15v-3.063A3.938 3.938 0 0 1 8.938 8h6.124A3.938 3.938 0 0 1 19 11.938V15a6.977 6.977 0 0 1-2 4.899" />
      <path fill="currentColor" d="M8.25 7.5a.75.75 0 0 0-1.5 0h1.5Zm-.615-2.917a.75.75 0 1 0 1.246.834l-1.246-.834ZM17.25 8.5v-1h-1.5v1h1.5Zm-10.5-1v1h1.5v-1h-1.5Zm10.5 0c0-2.9-2.35-5.25-5.25-5.25v1.5a3.75 3.75 0 0 1 3.75 3.75h1.5ZM12 2.25a5.246 5.246 0 0 0-4.365 2.333l1.246.834A3.746 3.746 0 0 1 12 3.75v-1.5Z" />
      <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M19 14h3M5 14H2M14.5 3.5L17 2M9.5 3.5L7 2m13.5 18l-2-.8m2-11.2l-2 .8M3.5 20l2-.8M3.5 8l2 .8M12 21.5V15" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <IconFill {...props}>
      <path fillRule="evenodd" d="M8.962 18.469C6.019 16.214 2 12.489 2 8.967C2 3.083 7.5.886 12 5.43C16.5.886 22 3.083 22 8.966c0 3.523-4.02 7.248-6.962 9.503C13.706 19.489 13.04 20 12 20c-1.04 0-1.706-.51-3.038-1.531ZM16.5 6.25a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5h-1.25V11a.75.75 0 0 1-1.5 0V9.75H14.5a.75.75 0 0 1 0-1.5h1.25V7a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </IconFill>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <IconFill {...props}>
      <g fill="currentColor">
        <path d="M12.553 16.506a.75.75 0 0 1-1.107 0l-4-4.375a.75.75 0 0 1 1.108-1.012l2.696 2.95V3a.75.75 0 0 1 1.5 0v11.068l2.697-2.95a.75.75 0 1 1 1.107 1.013l-4 4.375Z" />
        <path d="M3.75 15a.75.75 0 0 0-1.5 0v.055c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h6.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982c.602-.602.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337V15a.75.75 0 0 0-1.5 0c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103H9c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191Z" />
      </g>
    </IconFill>
  );
}

// ── Tab bar icons (stroke-based, matching prototype) ──

export function IconTabToday(props: IconProps) {
  return (
    <Icon strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

export function IconTabHistory(props: IconProps) {
  return (
    <Icon strokeWidth={1.8} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Icon>
  );
}

export function IconTabStats(props: IconProps) {
  return (
    <Icon strokeWidth={1.8} {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Icon>
  );
}

export function IconTabSettings(props: IconProps) {
  return (
    <Icon strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  );
}

// ── FAB icon ──

export function IconFabPlus(props: IconProps) {
  return (
    <svg
      width={props.size ?? 18}
      height={props.size ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ── Settings link icons (stroke) ──

export function IconUsers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  );
}

export function IconAlertCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  );
}

export function IconDownloadStroke(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  );
}

export function IconXClose(props: IconProps) {
  return (
    <svg
      width={props.size ?? 14}
      height={props.size ?? 14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

