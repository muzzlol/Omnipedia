/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
			base: '5px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},

		boxShadow: {
			light: '0px 2px 0px 0px #000',
			dark: '0px 2px 0px 0px #000',
		},
		translate: {
			boxShadowX: '0px',
			boxShadowY: '2px',
			reverseBoxShadowX: '0px',
			reverseBoxShadowY: '-2px',
		},
		fontWeight: {
			base: '500',
			heading: '700',
		},
  		colors: {
			// NEOBRUTALISM 
			main: '#88aaee',
			mainAccent: '#4d80e6', // not needed for shadcn components
			overlay: 'rgba(0,0,0,0.8)', // background color overlay for alert dialogs, modals, etc.

			// light mode
			bg: '#dfe5f2',
			text: '#000',
			border: '#000',

			// dark mode
			darkBg: '#272933',
			darkText: '#eeefe9',
			darkBorder: '#000',
			secondaryBlack: '#212121',

			// SHADCN
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: '#FFFFFC',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}