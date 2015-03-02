p 'started...'

Setting.create() if Setting.all.blank?

Product.destroy_all

def create_water_boils_sub_cat(cat_id)
  %w(Косвенного\ нагрева Накопительные Газовые Электрические).each do |c|
    SubCat.create(name: c, category_id: cat_id)
  end
end

def create_cauldrons_sub_cat(cat_id)
  %w(Твердотоплевные Настенные\ газовые Напольные\ газовые Электрические Конденсационные).each do |c|
    SubCat.create(name: c, category_id: cat_id)
  end
end

def create_radiators_sub_cat(cat_id)
  %w(Чугунные Биметаллические Алюминиевые Стальные ).each do |c|
    SubCat.create(name: c, category_id: cat_id)
  end
end

Category.destroy_all
SubCat.destroy_all
%w(Водонагреватели Котлы Насосы Радиаторы Термостаты Печи Трубы).each do |c|
  cat = Category.create(name: c)
  create_water_boils_sub_cat(cat.id) if c == 'Водонагреватели'
  create_cauldrons_sub_cat(cat.id) if c == 'Котлы'
  create_radiators_sub_cat(cat.id) if c == 'Радиаторы'
end

Firm.destroy_all
%w(Drazice Protherm Electrolux Atlantic Ariston Bosch Gorenie Thermex Viadrus Atmos Sakura AEG Vaillant Beretta Saunier\ Duval Energy Kospel).each do |f|
  Firm.create(name: f)
end

Status.destroy_all
[{name: 'В ожидании обработки',title: 'pending'},
 {name: 'Подготовка к доставке',title: 'binding'},
 {name: 'Товар(ы) в пути',title: 'moving'},
 {name: 'Товар(ы) в пунке самовывоза',title: 'ready'},
 {name: 'Заказ выполнен',title: 'delivered'},
 {name: 'Заказ отклонён',title: 'rejected'}].each do |s|
  Status.create(s)
end

@rand = nil
def rnd(from, to = nil)
  @rand = Random.new() if @rand.blank?
  unless to
    @rand.rand(from)
  else
    from + @rand.rand(to-from)
  end
end

product_count = 250
Product.destroy_all
cats = Category.all
sub_cats = SubCat.all
firms = Firm.all
name2 = %w(Оптимальный Экономный Мощный Качественный Экологичный Безвыхлопный Великолепный)
descriptions = [
    'Всегда пригодится. В каждый дом по 2 штуки!',
    'Крайне полезная вещь. Выглядят превосходно. Высокое качество.',
    'Одна из самых редких вещей. Для ценителей уникальности.',
    'Отличная вещь, стоит купить, не пожалеете!',
    'Качество превосходное, применяется легко и удобно, кто брал - не жаловался.',
    'Вполне подойдёт, как часть повседневных бытовых приборов. Приятный на ощупь материал.',
    'Эклсклюзивная вещь, за относительно небольщие деньги. Окрущающие будут вам завидовать!'
]

images = [
    'http://deteplo.com.ua/media/images/big/ATMOS-DC-40-SX-drova.jpg',
    'http://deteplo.com.ua/media/images/big/ATMOS-C-18-S-ugoldrova.jpg',
    'http://deteplo.com.ua/media/images/big/Viadrus-Hercules-U22-D4-20kW.jpg',
    'http://deteplo.com.ua/media/images/big/PROTHERM-kapibara-SOLITECH-PLUS-8-4869-kvt--drova--ugol-.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-ARISTON-Clas-EVO-28-FF-turbo--dymohod.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-ARISTON-GENUS-35-FF.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-ARISTON-BS-24-sF.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Themaclassic-s-25.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Saunier-Duval-Isotwin-F-30-H-MOD.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Saunier-Duval-Isofast-F-35-E-H-MOD.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-VAILLANT-turbo-TEC-pro-VUW-INT-242-3-MINI.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Gaz-4000-W-ZWA-24-AE.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Protherm-rys-28--28-kvt.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Protherm-gepard-23-MOV--23-kvt.jpg',
    'http://deteplo.com.ua/media/images/big/kotel-Protherm-rys-24---24-kvt.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-kosvennogo-nagreva-Drazice-OKC-200-NTR-bez-bokovogo-flanca.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-kosvennogo-nagreva-Drazice-OKC-200-NTRBP-s-bokovym-flancem.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-kosvennogo-nagreva-Drazice-OKC-300-NTR1-MPa.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-kosvennogo-nagreva-Drazice-OKC-300-NTRRBP-s-bokovym-flancem.jpg',
    'http://deteplo.com.ua/media/images/big/vodonagrevatel-elektricheskiy-nakopitelnyy-Drazice-OKCE-250S3-6kW.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-ARISTON-SB-R-80-V.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-ARISTON-ABS-VELIS-POWER-50-V-ploskiy.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-ARISTON-ABS-VELIS-PLUS-INOX-POWER-100-V-ploskiy.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-Gorenje-GT-10-O.jpg',
    'http://deteplo.com.ua/media/images/big/boyler-Gorenje-GBF-U-50-E-DD.gif',
    'http://deteplo.com.ua/media/images/big/boyler-Atlantic-ROUND-STANDART-50-VMR.jpg',
    'http://deteplo.com.ua/media/images/big/cirkulyacionnyy-nasos-GRUNDFOS-25-60180.jpg',
    'http://deteplo.com.ua/media/images/big/cirkulyacionnyy-nasos-WILLO-RS-2540-130_2.jpg'
]

product_count.times do
  cat = cats.sample
  firm = firms.sample
  sub_cat = nil
  actual_sub_cats = []
  sub_cats.each do|sc|
    if sc.category_id == cat.id
      actual_sub_cats << sc
    end
  end
  Product.create(
      name: "#{cat.name} #{(sub_cat.blank? ? '' : sub_cat.name)} #{firm.name} - #{name2.sample}",
      category: cat,
      sub_cat: actual_sub_cats.sample,
      firm: firm,
      description: descriptions.sample,
      usd_price: rnd(11,88),
      image: images.sample
  )
end