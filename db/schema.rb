# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150623141526) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "carts", force: :cascade do |t|
    t.integer  "user_id"
    t.float    "usd_rate",          default: 0.0
    t.float    "delivery_price",    default: 0.0
    t.float    "total_price",       default: 0.0
    t.boolean  "confirmed",         default: false
    t.string   "status",            default: "pending"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.integer  "zone_id"
    t.datetime "confirmation_date"
    t.boolean  "self_delivery",     default: false
    t.string   "address"
    t.float    "eur_rate"
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "is_default", default: false
    t.integer  "view_seq"
    t.integer  "edit_seq"
  end

  create_table "custom_pages", force: :cascade do |t|
    t.string   "label"
    t.text     "body"
    t.string   "title"
    t.text     "keywords"
    t.text     "description"
    t.string   "color"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "type"
    t.integer  "seq"
    t.string   "url"
    t.string   "visible_for", default: "all"
  end

  create_table "firms", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "is_default", default: false
    t.integer  "view_seq"
    t.integer  "edit_seq"
  end

  create_table "images", force: :cascade do |t|
    t.string   "src"
    t.integer  "product_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "positions", force: :cascade do |t|
    t.integer  "cart_id"
    t.integer  "product_id"
    t.integer  "count",      default: 1
    t.float    "price",      default: 0.0
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.float    "sum",        default: 0.0
    t.string   "name"
  end

  create_table "products", force: :cascade do |t|
    t.string   "name"
    t.integer  "type"
    t.float    "price"
    t.text     "description"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "category_id"
    t.integer  "firm_id"
    t.string   "image"
    t.boolean  "available",        default: true
    t.boolean  "exist",            default: true
    t.boolean  "hidden",           default: false
    t.integer  "sub_cat_id"
    t.string   "valute",           default: "RUB"
    t.text     "short_desc"
    t.text     "technical_desc"
    t.string   "country"
    t.string   "weight"
    t.text     "meta_keywords"
    t.text     "meta_description"
  end

  create_table "settings", force: :cascade do |t|
    t.text     "main_page_text"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.text     "contacts_text"
    t.float    "usd_rate"
    t.boolean  "recalculatable",            default: true
    t.string   "default_sort_type",         default: "firm"
    t.string   "map_code"
    t.string   "self_delivery_address"
    t.integer  "orders_per_page",           default: 3
    t.integer  "products_per_page",         default: 10
    t.text     "about_text"
    t.text     "price_list_text"
    t.text     "payment_and_delivery_text"
    t.text     "installation_text"
    t.float    "eur_rate"
    t.text     "meta_keywords"
    t.text     "meta_description"
  end

  create_table "statuses", force: :cascade do |t|
    t.string   "name"
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sub_cats", force: :cascade do |t|
    t.integer  "category_id"
    t.string   "name"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.boolean  "is_default",  default: false
    t.integer  "view_seq"
    t.integer  "edit_seq"
  end

  create_table "user_providers", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "identity"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "father_name"
    t.string   "address"
    t.string   "mobile"
    t.boolean  "is_admin",               default: false
    t.string   "yandex_token"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "zones", force: :cascade do |t|
    t.string   "name"
    t.string   "color"
    t.float    "price"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.float    "free_if_sum"
  end

end
