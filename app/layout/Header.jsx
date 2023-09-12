import { titleFont } from "~/util/fonts";
import Footer from '~/layout/Footer'

const Header = () => {
    return (
        <header className="w-[200px] text-center absolute top-3 left-3">
            <h1 className={titleFont.className + " mb"}>No Two Paths</h1>
            by: <a href="https://twitter.com/iam_cro" target="_blank">@crowexx</a>
            <div className="w-[70px] h-[90px] bg-white p-2 m-auto mt-5">
                <img src={'/i/buildspace-logo.png'} width="40" className="m-auto invert" />
                <p className="text-xs mt-2 mb-5 text-black">buildspace s4</p>
            </div>
            <Footer />
        </header>
    )
}

export default Header;