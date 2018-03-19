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

ActiveRecord::Schema.define(version: 20180313122114) do

  create_table "action_items", force: :cascade do |t|
    t.integer "priority"
    t.string "area"
    t.text "title"
    t.datetime "target_date"
    t.datetime "completion_date"
    t.string "sent_by"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
    t.integer "status", default: 0
    t.integer "creator_id"
    t.integer "assigned_to_id"
    t.index ["project_id"], name: "index_action_items_on_project_id"
  end

  create_table "action_items_equipment", id: false, force: :cascade do |t|
    t.integer "action_item_id", null: false
    t.integer "equipment_id", null: false
  end

  create_table "action_items_handvalves", id: false, force: :cascade do |t|
    t.integer "action_item_id", null: false
    t.integer "handvalve_id", null: false
  end

  create_table "action_items_instruments", id: false, force: :cascade do |t|
    t.integer "action_item_id", null: false
    t.integer "instrument_id", null: false
  end

  create_table "client_documents", force: :cascade do |t|
    t.string "document_name"
    t.string "document_number"
    t.string "document_revision"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "document_section"
    t.index ["project_id"], name: "index_client_documents_on_project_id"
  end

  create_table "client_team_members", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "organization"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role"
    t.index ["project_id"], name: "index_client_team_members_on_project_id"
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
    t.integer "datasheet_complete", default: 0
    t.integer "datasheet_released", default: 0
    t.integer "rfq_sent", default: 0
    t.integer "po_placed", default: 0
    t.integer "drawing_for_approval_received", default: 0
    t.integer "drawing_for_approval_marked_up", default: 0
    t.integer "drawing_for_approval_sent_to_client", default: 0
    t.integer "drawing_for_approval_released_for_construction", default: 0
    t.integer "item_received_at_zeton", default: 0
    t.integer "item_inspected_and_released", default: 0
    t.integer "item_installed_by_mech", default: 0
    t.integer "item_grounded_by_elec", default: 0
    t.integer "item_inspected_by_eng", default: 0
    t.integer "project_id"
    t.datetime "datasheet_complete_completed_at"
    t.datetime "datasheet_released_completed_at"
    t.datetime "rfq_sent_completed_at"
    t.datetime "po_placed_completed_at"
    t.datetime "drawing_for_approval_received_completed_at"
    t.datetime "drawing_for_approval_marked_up_completed_at"
    t.datetime "drawing_for_approval_sent_to_client_completed_at"
    t.datetime "drawing_for_approval_released_for_construction_completed_at"
    t.datetime "item_received_at_zeton_completed_at"
    t.datetime "item_inspected_and_released_completed_at"
    t.datetime "item_installed_by_mech_completed_at"
    t.datetime "item_grounded_by_elec_completed_at"
    t.datetime "item_inspected_by_eng_completed_at"
    t.index ["project_id"], name: "index_equipment_on_project_id"
  end

  create_table "equipment_information_requests", id: false, force: :cascade do |t|
    t.integer "equipment_id", null: false
    t.integer "information_request_id", null: false
  end

  create_table "handvalves", force: :cascade do |t|
    t.string "tag"
    t.string "valve_code"
    t.string "valve_type"
    t.string "size"
    t.string "line_number"
    t.string "zeton_skid_number"
    t.string "zeton_skid_level"
    t.string "scope"
    t.string "supplier"
    t.string "manufacturer"
    t.string "model"
    t.string "process_connection"
    t.string "material_of_construction"
    t.string "valve_counting_code"
    t.string "valve_location"
    t.string "zeton_po"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
    t.integer "valve_description_complete", default: 0
    t.integer "valve_description_approved", default: 0
    t.integer "po_placed", default: 0
    t.integer "item_received", default: 0
    t.integer "item_inspected_and_released", default: 0
    t.integer "item_mounted", default: 0
    t.integer "item_plumbed", default: 0
    t.integer "item_checked_by_eng", default: 0
    t.datetime "valve_description_complete_completed_at"
    t.datetime "valve_description_approved_completed_at"
    t.datetime "po_placed_completed_at"
    t.datetime "item_received_completed_at"
    t.datetime "item_inspected_and_released_completed_at"
    t.datetime "item_mounted_completed_at"
    t.datetime "item_plumbed_completed_at"
    t.datetime "item_checked_by_eng_completed_at"
    t.index ["project_id"], name: "index_handvalves_on_project_id"
  end

  create_table "handvalves_information_requests", id: false, force: :cascade do |t|
    t.integer "handvalve_id", null: false
    t.integer "information_request_id", null: false
  end

  create_table "information_requests", force: :cascade do |t|
    t.string "zeton_clarification"
    t.integer "answered", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "equipment_id"
    t.integer "instrument_id"
    t.integer "project_id"
    t.datetime "target_date"
    t.string "area"
    t.integer "client_team_member_id"
    t.integer "client_document_id"
    t.datetime "date_sent"
    t.index ["client_document_id"], name: "index_information_requests_on_client_document_id"
    t.index ["client_team_member_id"], name: "index_information_requests_on_client_team_member_id"
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
    t.string "item_type"
    t.string "location"
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
    t.integer "project_id"
    t.datetime "datasheet_submitted_for_approval_completed_at"
    t.datetime "datasheet_approved_completed_at"
    t.datetime "rfq_sent_completed_at"
    t.datetime "po_placed_completed_at"
    t.datetime "item_received_completed_at"
    t.datetime "item_inspected_and_released_completed_at"
    t.datetime "mounted_by_mechanical_completed_at"
    t.datetime "plumbed_by_mechanical_completed_at"
    t.datetime "cable_pulled_completed_at"
    t.datetime "cable_terminated_at_source_completed_at"
    t.datetime "cable_terminated_at_destination_completed_at"
    t.datetime "continuity_tested_completed_at"
    t.datetime "grounded_by_electrical_completed_at"
    t.datetime "checked_by_eng_completed_at"
    t.index ["project_id"], name: "index_instruments_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "project_number"
    t.string "project_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "client"
    t.datetime "project_start_date"
    t.datetime "project_end_date"
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
