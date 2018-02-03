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

ActiveRecord::Schema.define(version: 20180203005145) do

  create_table "documents", force: :cascade do |t|
    t.string "name"
    t.string "phase"
    t.string "timing"
    t.string "file_location"
    t.string "document_type"
    t.string "revision_name"
    t.string "revision_type"
    t.string "revision_frequency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
    t.integer "prepared_by_id"
    t.integer "delivered_to_id"
    t.string "prepared_by_role"
    t.string "delivered_to_role"
    t.integer "status", default: 0
    t.index ["delivered_to_id"], name: "index_documents_on_delivered_to_id"
    t.index ["prepared_by_id"], name: "index_documents_on_prepared_by_id"
    t.index ["project_id"], name: "index_documents_on_project_id"
  end

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
    t.integer "project_id"
    t.index ["project_id"], name: "index_equipment_on_project_id"
  end

  create_table "equipment_information_requests", id: false, force: :cascade do |t|
    t.integer "equipment_id", null: false
    t.integer "information_request_id", null: false
  end

  create_table "information_requests", force: :cascade do |t|
    t.string "client_document_number"
    t.string "client_document_title"
    t.string "client_document_revision"
    t.string "client_document_section"
    t.string "zeton_clarification"
    t.integer "answered"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "equipment_id"
    t.integer "instrument_id"
    t.integer "project_id"
    t.index ["equipment_id"], name: "index_information_requests_on_equipment_id"
    t.index ["instrument_id"], name: "index_information_requests_on_instrument_id"
    t.index ["project_id"], name: "index_information_requests_on_project_id"
  end

  create_table "information_requests_instruments", id: false, force: :cascade do |t|
    t.integer "instrument_id", null: false
    t.integer "information_request_id", null: false
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
    t.integer "datasheet_submitted_for_approval", default: 0
    t.integer "datasheet_approved", default: 0
    t.integer "rfq_sent", default: 0
    t.integer "po_placed", default: 0
    t.integer "item_received", default: 0
    t.integer "item_inspected_and_released", default: 0
    t.integer "mounted_by_mechanical", default: 0
    t.integer "plumbed_by_mechanical", default: 0
    t.integer "cable_pulled", default: 0
    t.integer "cable_terminated_at_source", default: 0
    t.integer "cable_terminated_at_destination", default: 0
    t.integer "continuity_tested", default: 0
    t.integer "grounded_by_electrical", default: 0
    t.integer "checked_by_eng", default: 0
    t.integer "instrument_id"
    t.integer "project_id"
    t.index ["instrument_id"], name: "index_instruments_on_instrument_id"
    t.index ["project_id"], name: "index_instruments_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "project_number"
    t.string "project_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "rfi_responses", force: :cascade do |t|
    t.text "response"
    t.integer "information_request_id"
    t.string "organization"
    t.string "responder"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["information_request_id"], name: "index_rfi_responses_on_information_request_id"
  end

  create_table "team_members", force: :cascade do |t|
    t.integer "user_id"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role"
    t.index ["project_id"], name: "index_team_members_on_project_id"
    t.index ["user_id"], name: "index_team_members_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", null: false
    t.string "encrypted_password", limit: 128, null: false
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128, null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

end
