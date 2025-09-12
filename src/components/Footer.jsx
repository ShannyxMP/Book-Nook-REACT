import React from "react";

function Footer() {
    const yearNow = new Date().getFullYear(); // NOTE: previous project determined current year on server side which eventually gets transferred to the footer.ejs
    return (
        <div>
            <div class="auto-scrollUp">
            {/* <!-- Fixed button to navigate to the top of the page --> */}
                <a href="#Book-Nook"><span class="material-icons-round">keyboard_double_arrow_up</span></a>
            </div>
        
            <footer>
                <p>
                <span>
                    ⋅•⋅⊰∙∘☽
                </span>
                <a href="https://github.com/ShannyxMP">
                    ShannyxMP
                </a>
                © {yearNow}
                <span>
                    ☾∘∙⊱⋅•⋅
                </span>
                </p>
            </footer>
        </div>
    )
}

export default Footer;