"use client"

const partners = [
  "Dongxiao",
  "Sinophos",
  "NHU",
  "Fufeng",
  "Meihua",
  "New Hope Group",
]

export function PartnersSection() {
  return (
    <section className="bg-[#FDFBF7] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1B4D3E] sm:text-3xl">
            Trusted by <span className="text-[#E9B35F]">Industry Leaders</span>
          </h2>
        </div>

        {/* Partner Logos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex h-20 w-36 items-center justify-center rounded-2xl border border-[#A3B18A] bg-white px-6 py-4 transition-all duration-300 hover:border-[#2D6A4F] hover:opacity-100 opacity-70 hover:shadow-md sm:h-24 sm:w-40"
            >
              <span className="text-center text-sm font-semibold text-[#636E72]">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
