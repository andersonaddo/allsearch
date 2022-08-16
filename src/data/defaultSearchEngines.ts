import { Hotbar, SearchEngineCategoryDefinition, SearchEngineCategoryId } from "./searchEngineTypes"

export const defaultHotbar: Hotbar = {
    google: "engine",
    yahoo: "engine",
    bing: "engine",
}

export const customSearchEnginesTemplate: SearchEngineCategoryDefinition = {
    title: "Custom",
    description: "Where you can put your own engines",
    isCustomCategory: true,
    engines: {}, //will be substituted with getCustomSearchEngineList by whatever uses it
}

export const defaultSearchEngineCategories: Record<SearchEngineCategoryId, SearchEngineCategoryDefinition> = {
    generalist: {
        title: "Generalist",
        description: "Engines that are good at everything.",
        engines: {
            google: {
                name: "Google",
                shortcut: "g",
                query: "https://www.google.com/search?q={searchTerms}",
                logoUrl: "https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png",
                description: "A search engine run the American multinational technology company Google LLC"
            },
            bing: {
                name: "Bing",
                shortcut: "b",
                query: "https://www.bing.com/search?q={searchTerms}",
                logoUrl: "https://w7.pngwing.com/pngs/138/377/png-transparent-bing-news-logo-microsoft-msn-microsoft-angle-search-engine-optimization-rectangle.png",
                description: "A web search engine owned and operated by Microsoft."
            },
            yahoo: {
                name: "Yahoo",
                parent: "bing",
                shortcut: "y",
                query: "https://search.yahoo.com/search?q={searchTerms}",
                logoUrl: "https://e7.pngegg.com/pngimages/480/867/png-clipart-yahoo-social-media-logo-advertising-whatsapp-purple-company.png",
                description: "A search engine run by Yahoo! and powered by Microsoft's Bing"
            },
            brave: {
                name: "Brave",
                shortcut: "b",
                query: "https://search.brave.com/search?q={searchTerms}",
                logoUrl: "https://brave.com/static-assets/images/brave-logo-no-shadow.png",
                description: "A search engine run by Brave Software, Inc."
            },
            ddg: {
                name: "Duck Duck Go",
                shortcut: "u",
                query: "https://duckduckgo.com/?q={searchTerms}",
                logoUrl: "https://upload.wikimedia.org/wikipedia/en/archive/9/90/20211207123704%21The_DuckDuckGo_Duck.png",
                description: "An internet search engine that emphasizes protecting searchers' privacy and avoiding personalized search results."
            },
            mwmbl: {
                name: "MWMBL",
                shortcut: "u",
                query: "https://mwmbl.org/?q={searchTerms}",
                logoUrl: "https://mwmbl.org/images/logo.svg",
                description: "An open source, non-profit search engine implemented in python."
            },

            //https://www.reddit.com/r/sysadmin/comments/ew3i2y/comment/fg05efq
            googleverbatim: {
                name: "Google Verbatim",
                shortcut: "v",
                query: "https://www.google.com/search?hl=en&tbs=li:1&q={searchTerms}",
                logoUrl: "https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png",
                description: "A version of Google search that puts more emphasis on your query and less on semantic/AI inference. Useful for particular searches."
            },

            //https://news.ycombinator.com/item?id=29161545
            you: {
                name: "You.com",
                shortcut: "y",
                query: "https://you.com/search?q={searchTerms}",
                logoUrl: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/mw1hgegq2viixdiq6qbd",
                description: "You.com is an ad-free, private search engine."
            }
        }
    },
    images: {
        title: "Image Engines",
        description: "Engines that are good for image searches.",
        engines: {

            //https://news.ycombinator.com/item?id=29140175
            logosearch: {
                name: "LogoSearch",
                shortcut: "s",
                query: "https://logosear.ch/search.html?q={searchTerms}",
                logoUrl: "https://logosear.ch/favicon.svg",
            },
        }
    },
    niche: {
        title: "Niche Engines",
        description: "Engines with niche specialties.",
        engines: {

            //https://news.ycombinator.com/item?id=28550764
            marginalia: {
                name: "Marginalia",
                shortcut: "m",
                query: "https://search.marginalia.nu/search?q={searchTerms}",
                description: "	A search engine that favors text-heavy sites and punishes modern web design."
            },

            //https://news.ycombinator.com/item?id=29161545
            startup: {
                name: "Startupy",
                shortcut: "s",
                query: "https://beta.startupy.world/search/?value={searchTerms}",
                description: "A search engine where the entries are all added in my hand. Requires sign up.",
                logoUrl: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/e7ajt735ayix3dqvdqr4"
            },
        }
    }
}
