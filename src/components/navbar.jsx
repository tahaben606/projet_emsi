import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
    return (
        <header className="bg-white border-b sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Brand Section */}
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center">
                        <img
                            src="/navlogo.png"
                            alt="EMSI Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </a>

                    <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Academic Flow
                        </h1>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Risk Detection System
                        </p>
                    </div>
                </div>

                {/* Status Section */}
                <nav
                    aria-label="System status"
                    className="flex items-center w-fit gap-2"
                >
                    <Button type="button" variant="outline" className="w-32">
                        <Link href="/login">Login</Link>
                    </Button>

                    <Button type="button" className="w-32">
                        <Link href="/register">Register</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
