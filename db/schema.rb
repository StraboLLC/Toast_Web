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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120610192324) do

  create_table "albums", :force => true do |t|
    t.string   "name"
    t.boolean  "public"
    t.string   "cover"
    t.datetime "uploaded_at"
    t.string   "token"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "user_id"
  end

  create_table "captures", :force => true do |t|
    t.string   "title"
    t.string   "token"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.text     "description"
    t.string   "media_type"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "album_id"
  end

  create_table "users", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "email"
    t.string   "address"
    t.string   "city"
    t.string   "state"
    t.datetime "paid_at"
    t.datetime "expires_at"
    t.string   "zip"
    t.string   "name"
    t.string   "password"
  end

end
