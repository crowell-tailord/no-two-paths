const Header = () => {
    return (
        <header className="w-[200px] text-center absolute top-3 left-3">
            <h2 className="mb-5">No Two Paths</h2>
            <img src={'/i/buildspace-logo.png'} width="50" className="m-auto" />
            <p className="text-xs mt-2 mb-5">buildspace s4</p>
            <a href="https://twitter.com/iam_cro" target="_blank">↠ @crowexx</a><br /><span className="text-xs">(^ dm for bugs)</span>
        </header>
    )
}

export default Header;