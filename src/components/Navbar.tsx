import type React from "preact/compat"

interface NavbarProps {
    title: string,
    buttonText: string,
    path: string,
    children?: React.ReactNode

}

export default function Navbar(props: NavbarProps) {
    return (
        <div class="navbar bg-base-100">
            <div class="navbar-start">
                <a class="btn btn-ghost text-xl">{props.title}</a>
            </div>
            {props.children}
            <div class="navbar-end">
                <a href={props.path} class="btn bg-primary">{props.buttonText}</a>
            </div>
        </div>
    )
}