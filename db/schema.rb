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

ActiveRecord::Schema.define(version: 20180123145619) do

  create_table "equipment", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tag"
    t.string "description"
    t.string "equipment_type"
    t.string "scope"
    t.string "supplier"
    t.string "manufacturer"
    t.string "model_number"
    t.string "zeton_po"
    t.string "tracking_number"
    t.string "receiving_info"
    t.integer "datasheet_complete"
    t.integer "datasheet_released"
    t.integer "rfq_sent"
    t.integer "po_placed"
    t.integer "drawing_for_approval_received"
    t.integer "drawing_for_approval_marked_up"
    t.integer "drawing_for_approval_sent_to_client"
    t.integer "drawing_for_approval_released_for_construction"
    t.integer "item_received_at_zeton"
    t.integer "item_inspected_and_released"
    t.integer "item_installed_by_mech"
    t.integer "item_grounded_by_elec"
    t.integer "item_inspected_by_eng"
  end

  create_table "instruments", force: :cascade do |t|
    t.string "type_code"
    t.string "loop"
    t.string "zeton_skid_number"
    t.string "zeton_skid_level"
    t.string "scope"
    t.string "mech_elec"
    t.string "supplier"
    t.string "manufacturer"
    t.string "model"
    t.string "process_connection"
    t.string "material_of_construction"
    t.integer "item_type"
    t.integer "location"
    t.string "dcs_io_type"
    t.string "range"
    t.string "zeton_po"
    t.string "tracking_number"
    t.string "receiving_info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "datasheet_submitted_for_approval"
    t.integer "datasheet_approved"
    t.integer "rfq_sent"
    t.integer "po_placed"
    t.integer "item_received"
    t.integer "item_inspected_and_released"
    t.integer "mounted_by_mechanical"
    t.integer "plumbed_by_mechanical"
    t.integer "cable_pulled"
    t.integer "cable_terminated_at_source"
    t.integer "cable_terminated_at_destination"
    t.integer "continuity_tested"
    t.integer "grounded_by_electrical"
    t.integer "checked_by_eng"
  end

end
