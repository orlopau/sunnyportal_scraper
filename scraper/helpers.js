class Helpers{
    /**
     * Performs login action and navigates to next site.
     * @param page
     * @param pass {string} password
     * @param user {string} username
     * @returns {Promise<void>}
     */
    static async authenticate(page, pass, user) {
        let user_field = await page.$("#txtUserName");
        let password_field = await page.$("#txtPassword");
        let button = await page.$("#ctl00_ContentPlaceHolder1_Logincontrol1_LoginBtn");

        if(user == null || pass == null){
            throw new TypeError("No username or password specified")
        }

        await user_field.type(user);
        await password_field.type(pass);

        const navPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        await button.click();
        await navPromise;
    }

    /**
     * navigates from logged in start page to current status
     * @returns {Promise<void>}
     */
    static async navigateToStatusPage(page){
        let button_chevron = await page.$("#collapseNavi");
        await button_chevron.click();

        let nav_promise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        let button_status = await page.$("#ctl00_NavigationLeftMenuControl_0_2");
        await button_status.click();
        await nav_promise;
    }  
}

module.exports = Helpers;