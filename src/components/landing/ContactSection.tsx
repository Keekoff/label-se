const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-bg-light">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">
          Prêt à démarrer ?
        </h2>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-landing">
          <iframe
            width="100%"
            height="900"
            src="https://418f5a01.sibforms.com/serve/MUIFAN0b4FqnU2OeWAobJy17uOVYZ07B__SvOt_ODM76pN_vwmxdFNvZwwFX_6QgzoFKNRPySKi-eRxAu3p9HGZ1JrSedy_PeZneBF1yqUGPuDxvMwvU8GL-gYq6DzpKdlQKIK3qmWQqHVUG6PR8YBaU7uIbc_TPL_oY8zVGXC-r16P-rf3Xa5NW5ApaQ5xe3N1S_U77dkuT0RRw"
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
            className="block mx-auto max-w-full"
            title="Formulaire de contact"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
