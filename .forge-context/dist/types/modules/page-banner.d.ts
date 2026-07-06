/**
 * Type definitions for PageBannerContext
 */
export interface PageBannerContext {
    type: 'confluence:pageBanner';
    content: {
        id: string;
        type: string;
        subtype?: string;
    };
    space: {
        id: string;
        key: string;
    };
    location: string;
}
