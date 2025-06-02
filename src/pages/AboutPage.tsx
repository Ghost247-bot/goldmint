import React from 'react';
import { Shield, Award, Users, Clock, Gem, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg"
          alt={t('about.hero.imageAlt')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container-custom mx-auto h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-medium text-charcoal-dark mb-6">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('about.mission.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-serif font-medium text-charcoal-dark text-center mb-12">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-gold" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('about.values.trust.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.trust.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-gold" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('about.values.excellence.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.excellence.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gold" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('about.values.client.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.client.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-serif font-medium text-charcoal-dark text-center mb-12">
            {t('about.whyChoose.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-elegant">
              <Clock className="text-gold mb-4" size={28} />
              <h3 className="text-xl font-medium mb-3">{t('about.whyChoose.experience.title')}</h3>
              <p className="text-gray-600">
                {t('about.whyChoose.experience.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-elegant">
              <Gem className="text-gold mb-4" size={28} />
              <h3 className="text-xl font-medium mb-3">{t('about.whyChoose.products.title')}</h3>
              <p className="text-gray-600">
                {t('about.whyChoose.products.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-elegant">
              <Scale className="text-gold mb-4" size={28} />
              <h3 className="text-xl font-medium mb-3">{t('about.whyChoose.pricing.title')}</h3>
              <p className="text-gray-600">
                {t('about.whyChoose.pricing.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-serif font-medium text-charcoal-dark text-center mb-12">
            {t('about.team.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
                alt={t('about.team.ceo.name')}
                className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-medium">{t('about.team.ceo.name')}</h3>
              <p className="text-gold mb-2">{t('about.team.ceo.position')}</p>
              <p className="text-gray-600 text-sm">
                {t('about.team.ceo.description')}
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg"
                alt={t('about.team.coo.name')}
                className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-medium">{t('about.team.coo.name')}</h3>
              <p className="text-gold mb-2">{t('about.team.coo.position')}</p>
              <p className="text-gray-600 text-sm">
                {t('about.team.coo.description')}
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                alt={t('about.team.cto.name')}
                className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-medium">{t('about.team.cto.name')}</h3>
              <p className="text-gold mb-2">{t('about.team.cto.position')}</p>
              <p className="text-gray-600 text-sm">
                {t('about.team.cto.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-charcoal-dark text-white">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/category/bars" className="btn btn-primary">
              {t('about.cta.primary')}
            </a>
            <a href="/contact" className="btn btn-outline border-gold text-gold hover:bg-gold hover:text-white">
              {t('about.cta.secondary')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;