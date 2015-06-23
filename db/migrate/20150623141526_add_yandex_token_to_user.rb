class AddYandexTokenToUser < ActiveRecord::Migration
  def change
    add_column :users, :yandex_token, :string
  end
end
