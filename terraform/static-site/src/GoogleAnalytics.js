export const initializeAnalytics = () => {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-W0K9FGCN59";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    const inlineScript = document.createTextNode(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W0K9FGCN59');
    `);
    script2.appendChild(inlineScript);
    document.head.appendChild(script2);
};
