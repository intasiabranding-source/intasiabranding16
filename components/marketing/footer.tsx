import Link from "next/link";

type FooterProps = {
  brandName: string;
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
};

export function Footer({ brandName, email, phone, instagram }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-bold gradient-text">{brandName}</p>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Your all-in-one digital growth ecosystem. Branding, development, marketing, and AI automation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {email && <li>{email}</li>}
              {phone && <li>{phone}</li>}
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
