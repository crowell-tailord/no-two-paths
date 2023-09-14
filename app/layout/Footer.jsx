import { version } from '~/util/Config'

const Footer = () => {
    return (
        <footer className="text-center text-xs p-2 font-mono">v{version}</footer>
    )
}

export default Footer;