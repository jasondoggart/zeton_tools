class Handvalve < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  validates_presence_of :tag
  validates :valve_description_complete,
    :valve_description_approved,
    :po_placed,
    :item_received,
    :item_inspected_and_released,
    :item_mounted,
    :item_plumbed,
    :item_checked_by_eng,
    inclusion: { in: [0,1,2] }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^tag_/
      order("handvalves.tag #{direction}")
    end
  }

  scope :with_type, -> (valve_type) {
    where(valve_type: valve_type)
  }

  scope :with_size, -> (valve_size) {
    where(size: valve_size)
  }

  def self.metrics_attributes
    [
      "valve_description_complete",
      "valve_description_approved",
      "po_placed",
      "item_received",
      "item_inspected_and_released",
      "item_mounted",
      "item_plumbed",
      "item_checked_by_eng"
    ]
  end

  def self.data_attributes
    [
      "tag",
      "valve_code",
      "valve_type",
      "size",
      "line_number",
      "zeton_skid_number",
      "zeton_skid_level",
      "scope",
      "supplier",
      "manufacturer",
      "model",
      "process_connection",
      "material_of_construction",
      "valve_counting_code",
      "valve_location",
      "zeton_po"
    ]
  end

  def self.data_headings
    properties = Hash.new
    self.data_attributes.each do |attr|
      properties[attr.to_sym] = Hash.new
      properties[attr.to_sym][:icon] = ''
      properties[attr.to_sym][:title] = ''
    end
    properties[:tag][:icon] = '<i class="fas fa-tag"></i>'
    properties[:tag][:title] = 'Tag'
    properties[:valve_code][:icon] = '<i class="fas fa-hashtag"></i>'
    properties[:valve_code][:title] = 'Valve Specification'
    properties[:valve_type][:icon] = '<i class="far fa-dot-circle"></i>'
    properties[:valve_type][:title] = 'Type'
    properties[:size][:icon] = '<i class="fas fa-compress"></i>'
    properties[:size][:title] = 'Size'
    properties[:line_number][:icon] = '<i class="fas fa-map-pin"></i>'
    properties[:line_number][:title] = 'Line Number'
    properties[:zeton_skid_number][:icon] = '<i class="fas fa-bullseye"></i>'
    properties[:zeton_skid_number][:title] = 'Skid Number'
    properties[:zeton_skid_level][:icon] = '<i class="fas fa-bullseye"></i>'
    properties[:zeton_skid_level][:title] = 'Skid Level'
    properties[:scope][:icon] = '<i class="far fa-hand-point-right"></i>'
    properties[:scope][:title] = 'Scope'
    properties[:supplier][:icon] = '<i class="fas fa-dollar-sign"></i>'
    properties[:supplier][:title] = 'Supplier'
    properties[:manufacturer][:icon] = '<i class="far fa-building"></i>'
    properties[:manufacturer][:title] = 'Manufacturer'
    properties[:model][:icon] = '<i class="fas fa-hashtag"></i>'
    properties[:model][:title] = 'Model Number'
    properties[:process_connection][:icon] = '<i class="fas fa-wrench"></i>'
    properties[:process_connection][:title] = 'Process Connection'
    properties[:material_of_construction][:icon] = '<i class="fas fa-certificate"></i>'
    properties[:material_of_construction][:title] = 'Material of Construction'
    properties[:valve_counting_code][:icon] = '<i class="fas fa-signal"></i>'
    properties[:valve_counting_code][:title] = 'Statistics Code'
    properties[:valve_location][:icon] = '<i class="fas fa-hashtag"></i>'
    properties[:valve_location][:title] = 'Line or Equip'
    properties[:zeton_po][:icon] = '<i class="fas fa-shopping-cart"></i>'
    properties[:zeton_po][:title] = 'PO Number'
    properties
  end
end
