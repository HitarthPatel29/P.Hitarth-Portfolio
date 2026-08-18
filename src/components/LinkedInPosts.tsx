import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import {
  linkedInEmbedUrl,
  linkedInPostUrl,
  linkedinPosts,
  profile,
} from '../data/resumeData';
import { cn } from '../lib/cn';
import { Card } from './ui/Card';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

const dismissRetorts = [
  'Mark all as read',
  'Nice try — they stay unread.',
  'Still unread. Recruiters get the same treatment.',
  'This button is decorative. Read the posts.',
];

export function LinkedInPosts() {
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    duration: reduceMotion ? 0 : 28,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  // LinkedIn embeds are heavy; only mount the iframes for slides the visitor
  // has actually scrolled to.
  const [sectionVisible, setSectionVisible] = useState(false);
  const [seenSlides, setSeenSlides] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const syncControls = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
      setSelected(emblaApi.selectedScrollSnap());
      setSnapCount(emblaApi.scrollSnapList().length);
    };

    const trackVisibleSlides = () => {
      const inView = emblaApi.slidesInView();
      setSeenSlides((previous) => {
        const next = inView.filter((index) => !previous.includes(index));
        return next.length ? [...previous, ...next] : previous;
      });
    };

    syncControls();
    trackVisibleSlides();
    emblaApi.on('select', syncControls).on('reInit', syncControls);
    emblaApi.on('slidesInView', trackVisibleSlides).on('reInit', trackVisibleSlides);

    return () => {
      emblaApi.off('select', syncControls).off('reInit', syncControls);
      emblaApi.off('slidesInView', trackVisibleSlides).off('reInit', trackVisibleSlides);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [dismissAttempts, setDismissAttempts] = useState(0);
  const dismissLabel =
    dismissRetorts[Math.min(dismissAttempts, dismissRetorts.length - 1)];

  return (
    <Section
      id="posts"
      eyebrow="Push Notifications"
      title={`Notifications (${linkedinPosts.length} Unread)`}
    >
      <div ref={sectionRef}>
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm leading-relaxed text-muted">
                Build logs, shipping notes, and lessons from the projects above — written as they
                happened. Zero “thrilled to announce” energy, no motivational airport stories.
              </p>
              <button
                type="button"
                onClick={() => setDismissAttempts((count) => count + 1)}
                className="mt-2.5 text-xs text-gold/80 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                {dismissLabel}
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <CarouselButton
                label="Previous post"
                onClick={scrollPrev}
                disabled={!canPrev}
                icon={<ChevronLeft size={18} aria-hidden="true" />}
              />
              <CarouselButton
                label="Next post"
                onClick={scrollNext}
                disabled={!canNext}
                icon={<ChevronRight size={18} aria-hidden="true" />}
              />
            </div>
          </div>

          <div
            className="overflow-hidden"
            ref={emblaRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="LinkedIn posts"
          >
            <ul className="-ml-5 flex touch-pan-y">
              {linkedinPosts.map((post, index) => (
                <li
                  key={post.urn}
                  className="min-w-0 shrink-0 grow-0 basis-full pl-5 md:basis-1/2 lg:basis-1/3"
                  aria-roledescription="slide"
                  aria-label={`Post ${index + 1} of ${linkedinPosts.length}`}
                >
                  <PostCard
                    urn={post.urn}
                    index={index}
                    embedIframe={sectionVisible && seenSlides.includes(index)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: snapCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === selected ? 'true' : undefined}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === selected ? 'w-7 bg-gold' : 'w-1.5 bg-muted/40 hover:bg-muted/70',
                  )}
                />
              ))}
            </div>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-muted"
            >
              See the full notification feed on LinkedIn
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-cream transition-colors hover:border-hairline-strong hover:bg-navy-raised disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-hairline disabled:hover:bg-transparent"
    >
      {icon}
    </button>
  );
}

function PostCard({
  urn,
  index,
  embedIframe,
}: {
  urn: string;
  index: number;
  embedIframe: boolean;
}) {
  const postUrl = linkedInPostUrl(urn);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
        <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-eyebrow text-muted">
          <span className="relative flex">
            <Linkedin size={14} className="text-gold/80" aria-hidden="true" />
            <span
              className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-gold"
              aria-hidden="true"
            />
          </span>
          Alert {String(index + 1).padStart(2, '0')}
        </span>
        <a
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-gold transition-colors hover:text-gold-muted"
        >
          Open
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      <div className="relative h-[26rem] sm:h-[30rem] lg:h-[32rem]">
        {embedIframe ? (
          <iframe
            src={linkedInEmbedUrl(urn)}
            title={`LinkedIn post ${index + 1}`}
            loading="lazy"
            allowFullScreen
            className="h-full w-full border-0 bg-white"
          />
        ) : (
          <div className="h-full w-full animate-pulse-soft bg-navy-deep/60" aria-hidden="true" />
        )}

        {/* The iframe swallows touch gestures, so on small screens this overlay
            takes the drag (and a tap opens the post). Desktop lets it through. */}
        <a
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 lg:pointer-events-none"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <a
        href={postUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 text-sm text-cream/80 transition-colors hover:bg-navy-raised hover:text-cream"
      >
        Open notification
        <ArrowUpRight size={15} className="text-gold/80" aria-hidden="true" />
      </a>
    </Card>
  );
}
