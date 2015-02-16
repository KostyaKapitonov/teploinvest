require 'net/http'

task :destroy_unconfirmed_users => :environment do
  User.where(confirmed_at: nil, confirmation_sent_at:  (Date.today-100.days)..(Date.today-2.days)).destroy_all
end

task :recalculate_exchange_rates => :environment do
  s = Setting.first
  begin
    if s.recalculatable
      xml_url = 'http://www.cbr.ru/scripts/XML_daily.asp'
      url = URI.parse(xml_url)
      req = Net::HTTP::Get.new(url.to_s)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      xml = Hash.from_xml(res.body)
      valutes = xml['ValCurs']['Valute']
      usd = nil
      valutes.each do |v|
        if v['CharCode'] && v['CharCode'].downcase == 'usd'
          usd = (v['Value'].sub! ',', '.').to_f
        end
      end
      raise 'usd.blank' if usd.blank? || usd == 0.0
      if s.usd_rate != usd
        s.update(usd_rate: usd) unless s.blank?
        carts = Cart.where(confirmed: false).all
        carts.update_all(usd_rate: usd)
        Product.recalculate_by_usd_rate(usd, carts)
        p 'Success! (new USD rate applied)'
      else
        p 'Success! (USD rate is already actual)'
      end
    end
  rescue Exception => e
    backtrace = ''
    e.backtrace.inspect.each do |l|
      backtrace += "#{l}<br/>"
    end
    ActionMailer::Base.mail(from: ENV['TEPLOINVEST_EMAIL_ADDRESS'], :to => 'kapitonovkg@sfdev.com',
      :subject => "Antalex schedule raise-error: #{e.message}", :body => backtrace,
      charset: 'UTF-8', content_type: "text/html").deliver_now

    # new_mail = GmailSender.new(ENV['ANTALEX_EMAIL_ADDRESS'], ENV['ANTALEX_EMAIL_PASSWORD'])
    # new_mail.send(:to => 'kapitonovkg@sfdev.com', :subject => "Antalex schedule raise-error: #{e.message}",
    #               :content => backtrace, content_type: 'text/html; charset="utf-8"')
      # p e.backtrace.inspect
  end
end