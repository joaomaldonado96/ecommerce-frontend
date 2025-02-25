export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-10">
            <div className="container mx-auto text-center">
                <p>Desarrollado por <strong>Joao Maldonado </strong>
                    | Email: <a href="mailto:joao.maldonado96@gmail.com" className="text-blue-400 hover:underline">joao.maldonado96@gmail.com </a>
                    | Teléfono: <a href="tel:+573163970812" className="text-blue-400 hover:underline">+57 316 397 0812 </a>
                    | LinkedIn:{" "}<a href="https://www.linkedin.com/in/joao-maldonado-a084151ba/" target="_blank"
                        rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Joao Maldonado
                    </a>
                </p>
            </div>
        </footer>
    );
}