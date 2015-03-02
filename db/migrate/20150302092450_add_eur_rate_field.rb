class AddEurRateField < ActiveRecord::Migration
  def change
    add_column :settings, :eur_rate, :float
    add_column :carts, :eur_rate, :float
    remove_column :products, :fixed_rub_price
    add_column :products, :valute, :string, default: 'RUB'
  end
end
