import { SearchEngineCategoryDefinition, SearchEngineCategoryId } from "../types/searchEngineTypes"

export const customSearchEnginesTemplate: SearchEngineCategoryDefinition = {
    title: "Custom",
    description: "Where you can put your own engines",
    isCustomCategory: true,
    engines: {}, //will be substituted with getCustomSearchEngineList by whatever uses it
}

export const defaultSearchEngineCategories: Record<SearchEngineCategoryId, SearchEngineCategoryDefinition> = {
    generalist: {
        title: "Generalist",
        description: "Engines that are designed to find all kinds of information.",
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
            baidu: {
                name: "Baidu",
                shortcut: "b",
                query: "https://www.baidu.com/s?wd={searchTerms}",
                logoUrl: "https://icons.iconarchive.com/icons/sicons/basic-round-social/512/baidu-icon.png",
                description: "The most popular search engine in China."
            },
            kagi: {
                name: "Kagi",
                shortcut: "k",
                query: "https://kagi.com/search?q={searchTerms}",
                description: "Kagi is a privacy-focused, user-centric search engine that uses an algorithm users can tweak. Requires a monthly subscription from its users.",
                logoUrl: "https://assets.kagi.com/v1/kagi_assets/logos/yellow_3.png?v=2d05f2eff57e227664d8eab839503754e7582b03",
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
            },
            naver: {
                name: "Naver",
                shortcut: "n",
                query: "https://search.naver.com/search.naver?query={searchTerms}",
                logoUrl: "https://play-lh.googleusercontent.com/Kbu0747Cx3rpzHcSbtM1zDriGFG74zVbtkPmVnOKpmLCS59l7IuKD5M3MKbaq_nEaZM=w240-h480-rw",
                description: "The most popular search tool and web portal in South Korea"
            },
            ecosia: {
                name: "Ecosia",
                shortcut: "n",
                query: "https://www.ecosia.org/search?q={searchTerms}",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ecosia-like_logo.png",
                description: "A search engine based in Berlin, Germany that donates 100% of its profits to nonprofit organizations focusing on reforestation."
            },
            yandex: {
                name: "Yandex",
                shortcut: "y",
                query: "https://yandex.com/search?text={searchTerms}",
                description: "A search engine and web portal popular in Russia.",
                logoUrl: "https://cdn.icon-icons.com/icons2/699/PNG/512/yandex_en_icon-icons.com_61632.png"
            },
            mojeek: {
                name: "Mojeek",
                shortcut: "m",
                query: "https://www.mojeek.com/search?q={searchTerms}",
                logoUrl: "https://www.mojeek.fr/logos/icon_cc.svg",
                description: "A search engine based in the United Kingdom. The search results provided by Mojeek come from its own index of web pages, created by crawling the web."
            },
            qwant: {
                name: "Qwant",
                shortcut: "m",
                query: "https://www.qwant.com/?q={searchTerms}",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Qwant-Icone-2022.svg",
                description: "A French meta search engine, launched in February 2013 and operated from Paris. It is one of the few EU-based meta-search engines."
            },
            searx: { //SearXNG has the searx id because initially I didn't know SearXNG and SearX were 2 different things (I only knew about searx).
                name: "SearXNG",
                shortcut: "x",
                query: "https://searx.org/search?q={searchTerms}",
                description: "A free and open-source metasearch engine, available under the AGPL-3.0 license. Different from SearX, which is a predecessor that is updated less frequently and designed for private use. Find more SearXNG instances at https://github.com/searxng/searxng",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/SearXNG-wordmark.svg/326px-SearXNG-wordmark.svg.png",
            },
            mwmbl: {
                name: "MWMBL",
                shortcut: "u",
                query: "https://mwmbl.org/?q={searchTerms}",
                logoUrl: "https://mwmbl.org/images/logo.svg",
                description: "An open source, non-profit search engine implemented in python."
            },
            seznam: {
                name: "Seznam",
                shortcut: "z",
                query: "https://search.seznam.cz/?q={searchTerms}",
                description: "A web portal and search engine in the Czech Republic.",
                logoUrl: "https://e7.pngegg.com/pngimages/182/349/png-clipart-symbol-trademark-number-seznam-trademark-logo-thumbnail.png"
            },
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
            bingimages: {
                name: "Bing Images",
                shortcut: "i",
                query: "https://www.bing.com/images/search?q={searchTerms}",
                logoUrl: "https://w7.pngwing.com/pngs/138/377/png-transparent-bing-news-logo-microsoft-msn-microsoft-angle-search-engine-optimization-rectangle.png",
            },
            baiduimages: {
                name: "Baidu Images",
                shortcut: "m",
                query: "https://image.baidu.com/search/index?tn=baiduimage&word={searchTerms}",
                logoUrl: "https://icons.iconarchive.com/icons/sicons/basic-round-social/512/baidu-icon.png",
            },
            flickr: {
                name: "Flickr",
                shortcut: "f",
                description: "Flickr is an American image hosting and video hosting service.",
                query: "https://www.flickr.com/search/?text={searchTerms}",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Flickr_large_white_chiclet_logo_-_no_rounded_corners%2C_no_border.svg/225px-Flickr_large_white_chiclet_logo_-_no_rounded_corners%2C_no_border.svg.png",
            },
            googleimages: {
                name: "Google Images",
                shortcut: "s",
                query: "https://www.google.com/search?q={searchTerms}&tbm=isch",
                logoUrl: "https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png",
            },
            yandeximages: {
                name: "Yandex Images",
                shortcut: "y",
                query: "https://yandex.com/images/search?text={searchTerms}",
                description: "The photo search portion of a search engine and web portal popular in Russia.",
                logoUrl: "https://cdn.icon-icons.com/icons2/699/PNG/512/yandex_en_icon-icons.com_61632.png"
            },
        }
    },
    academic: {
        title: "Academic Engines",
        description: "Engines good for looking for academic information.",
        engines: {
            googlescholar: {
                name: "Google Scholar",
                shortcut: "s",
                query: "https://scholar.google.com/scholar?q={searchTerms}",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Scholar_logo.svg/480px-Google_Scholar_logo.svg.png",
                description: "A freely accessible web search engine that indexes the full text or metadata of scholarly literature across an array of publishing formats and disciplines"
            },
            baidubaike: {
                name: "Baidu Baike",
                shortcut: "i",
                query: "https://baike.baidu.com/search?word={searchTerms}",
                logoUrl: "https://icons.iconarchive.com/icons/sicons/basic-round-social/512/baidu-icon.png",
                description: "A semi-regulated Chinese-language collaborative online encyclopedia owned by the Chinese technology company Baidu."
            },
            scite: {
                name: "Scite",
                shortcut: "s",
                query: "https://scite.ai/search?q={searchTerms}",
                logoUrl: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/fzrgvyt71msrkm2i1uh3",
                description: "A platform for discovering and evaluating scientific articles via Smart Citations. Requires a monthly subscription from its users."
            },
            vadlo: {
                name: "VADLO",
                shortcut: "v",
                query: "https://vadlo.com/Molecular_biology_Protocols_Search_Results.html?q={searchTerms}",
                description: "Search engine for laboratory methods, techniques, protocols, molecular databases and bioinformatic tools, commercial products, kits, and powerpoints."
            },
            searchonmath: {
                name: "SearchOnMath",
                shortcut: "m",
                query: "https://www.searchonmath.com/result/?q={searchTerms}",
                description: "A powerful search engine for mathematical formulas with LaTeX support. Requires a monthly subscription from its users.",
                logoUrl: "https://play-lh.googleusercontent.com/SD8u-Jb3T4VHYxH2-YjdHHPaUoZLUd_AVXK2_E3YMPoRMFiYsujyztCTz6c1T8boY43N"
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
                query: "https://search.marginalia.nu/search?query={searchTerms}",
                description: "	A search engine that favors text-heavy sites and punishes modern web design."
            },
            //https://news.ycombinator.com/item?id=29161545
            startup: {
                name: "Startupy",
                shortcut: "s",
                query: "https://beta.startupy.world/search/?value={searchTerms}",
                description: "A search engine where the entries are all added in by hand. Requires sign up.",
                logoUrl: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/e7ajt735ayix3dqvdqr4"
            },
            internetarchive: {
                name: "Internet Archive",
                shortcut: "a",
                query: "https://web.archive.org/web/*/{searchTerms}",
                description: "An American digital library with the stated mission of \"universal access to all knowledge.\"",
                logoUrl: "https://pbs.twimg.com/profile_images/717127559134056448/BYGRuZmj_400x400.jpg"
            },
            worldcat: {
                name: "WorldCat",
                shortcut: "w",
                query: "https://www.worldcat.org/search?q={searchTerms}",
                description: "A union catalog that itemizes the collections of tens of thousands of institutions, in many countries, that are current or past members of the OCLC global cooperative.",
                logoUrl: "https://library.stlawu.edu/sites/default/files/2020-02/worldcat-logo.png"
            },
            //https://news.ycombinator.com/item?id=3910304
            //https://news.ycombinator.com/item?id=30912733
            millionshortsanction:{ //ID is called millionshortsanction because it used to link to sanction.millionshort.com
                name: "Millionshort",
                shortcut: "h",
                query: "https://millionshort.com/search?keywords={searchTerms}",
                description: "A freemium search engine that can exclude the top 100-1,000,000 websites from search results. Mostly requires a monthly subscription from its users.",
                logoUrl: "https://pbs.twimg.com/profile_images/2624353171/gh9lof2wbak4x15fe0n1.png"
            },
            //https://news.ycombinator.com/item?id=23203100
            //https://news.ycombinator.com/item?id=19604135
            wiby:{
                name: "Wiby",
                shortcut: "w",
                query: "https://wiby.me/?q={searchTerms}",
                description: "The Wiby search engine is building a web of pages as it was in the earlier days of the internet. Manually curated.",
                logoUrl: "https://pbs.twimg.com/profile_images/967952274147500032/xdxjE51-_400x400.jpg"
            },
            //https://news.ycombinator.com/item?id=30912733
            breeze:{
                name: "Breeze",
                shortcut: "b",
                query: "https://breezethat.com/#gsc.tab=0&gsc.q={searchTerms}&gsc.sort=",
                description: "An engine that can also specialize in looking for recipes, Reddit posts, blog posts, and others. More specialties at https://breezethat.com/topics",
                logoUrl: "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/295245696_354782843512370_9129904740840257937_n.png?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=sBNjO2x0mzkAX-9lr03&_nc_ht=scontent-lga3-2.xx&oh=00_AfDcjFXi1sKT2SE1SbfyzU5VJVA7AYH69enClW0GJn-yPw&oe=64B64D0D"
            }
        }
    }
}
