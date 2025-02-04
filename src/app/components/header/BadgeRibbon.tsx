/**
 * Badge ribbon component, styled with double borders on top
 * and bottom with different sizes. Supports children so that
 * it can be used on desktop and mobile headers.
 */
export function BadgeRibbon({ children }: { children?: React.ReactNode }) {
    return (
        <div
            className={`flex w-full flex-grow flex-row border-y-2 border-black py-1`}
        >
            <div className="flex flex-grow flex-row items-center justify-evenly gap-4 border-y-4 border-black p-2">
                {children}
            </div>
        </div>
    );
}
