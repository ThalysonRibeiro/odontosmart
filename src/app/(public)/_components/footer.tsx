export function Footer() {
  return (
    <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
      <p>
        Todos os direitos reservados &copy; {new Date().getFullYear()} -<span className="trasiton duration-300 font-semibold hover:text-blue-500"> Odonto Smart</span>
      </p>
    </footer>
  )
}