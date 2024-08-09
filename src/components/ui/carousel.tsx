"use client";

import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }

    return context;
}

function useCarouselDots() {
    const { api } = useCarousel();
    const [selected, setSelected] = useState(0);
    const [slides, setSlides] = useState<number[]>([]);

    const onDotClick = useCallback(
        (index: number) => {
            if (api) api.scrollTo(index);
        },
        [api],
    );

    const onInit = useCallback((api: CarouselApi) => {
        setSlides(api!.scrollSnapList());
    }, []);

    const onSelect = useCallback((api: CarouselApi) => {
        setSelected(api!.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!api) return;

        onInit(api);
        onSelect(api);

        api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
        return () => {
            api.off("reInit", onInit)
                .off("reInit", onSelect)
                .off("select", onSelect);
        };
    }, [api, onInit, onSelect]);

    return { selected, slides, onDotClick };
}

const Carousel = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === "horizontal" ? "x" : "y",
            },
            plugins,
        );
        const [canScrollPrev, setCanScrollPrev] = useState(false);
        const [canScrollNext, setCanScrollNext] = useState(false);

        const onSelect = useCallback((api: CarouselApi) => {
            if (!api) {
                return;
            }

            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        const scrollPrev = useCallback(() => {
            api?.scrollPrev();
        }, [api]);

        const scrollNext = useCallback(() => {
            api?.scrollNext();
        }, [api]);

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext],
        );

        useEffect(() => {
            if (!api || !setApi) {
                return;
            }

            setApi(api);
        }, [api, setApi]);

        useEffect(() => {
            if (!api) {
                return;
            }

            onSelect(api);
            api.on("reInit", onSelect);
            api.on("select", onSelect);

            return () => {
                api?.off("select", onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    opts,
                    orientation:
                        orientation ||
                        (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    },
);
Carousel.displayName = "Carousel";

const CarouselContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div ref={ref} className={cn("flex", className)} {...props} />
        </div>
    );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
            {...props}
        />
    );
});
CarouselItem.displayName = "CarouselItem";

function CarouselDots({
    className,
    ...props
}: React.HTMLProps<HTMLDivElement>) {
    const { onDotClick, selected, slides } = useCarouselDots();

    return (
        <div
            className={cn(
                className,
                "hidden flex-row justify-center gap-0 p-0 min-[500px]:flex",
            )}
            {...props}
        >
            {slides.map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onMouseDown={() => {
                        onDotClick(i);
                    }}
                    className={cn(
                        className,
                        `appearance-none px-1.5 py-2 after:block after:h-2.5 after:w-2.5 after:rounded-full after:border-[1px] after:border-[#1a1a1a] after:border-opacity-50 after:content-[''] after:hover:bg-[#1a1a1a] after:hover:bg-opacity-10 min-[450px]:p-2 min-[500px]:p-2.5 min-[500px]:after:h-3 min-[500px]:after:w-3 ${i === selected ? "after:bg-[#1a1a1a] after:hover:bg-opacity-100" : "after:bg-transparent"}`,
                    )}
                />
            ))}
        </div>
    );
}

const CarouselPrevious = forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute  h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-left-12 top-1/2 -translate-y-1/2"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-right-12 top-1/2 -translate-y-1/2"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
});
CarouselNext.displayName = "CarouselNext";

export {
    Carousel,
    CarouselContent,
    CarouselDots,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
};
