class Equipment < ApplicationRecord
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project
  validates_presence_of :tag, :description, :equipment_type
  validates :datasheet_complete,
    :datasheet_released,
    :rfq_sent,
    :po_placed,
    :drawing_for_approval_received,
    :drawing_for_approval_marked_up,
    :drawing_for_approval_sent_to_client,
    :drawing_for_approval_released_for_construction,
    :item_received_at_zeton,
    :item_inspected_and_released,
    :item_installed_by_mech,
    :item_grounded_by_elec,
    :item_inspected_by_eng,
    inclusion: { in: [0,1,2] }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^type_/
      order("equipment.equipment_type #{direction}")
    when /^tag_/
      order("equipment.tag #{direction}")
    end
  }

  scope :with_type, -> (type) {
    where(equipment_type: type)
  }

  def self.metrics_attributes
    [
      "datasheet_complete",
      "datasheet_released",
      "rfq_sent",
      "po_placed",
      "drawing_for_approval_received",
      "drawing_for_approval_marked_up",
      "drawing_for_approval_sent_to_client",
      "drawing_for_approval_released_for_construction",
      "item_received_at_zeton",
      "item_inspected_and_released",
      "item_installed_by_mech",
      "item_grounded_by_elec",
      "item_inspected_by_eng"
    ]
  end

  def self.data_attributes
    [
      "tag",
      "description",
      "equipment_type",
      "scope",
      "supplier",
      "manufacturer",
      "model_number",
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
    properties[:description][:icon] = '<i class="fas fa-align-justify"></i>'
    properties[:description][:title] = "Description"
    properties[:equipment_type][:icon] = '<i class="far fa-dot-circle"></i>'
    properties[:equipment_type][:title] = "Equipment Type"
    properties[:scope][:icon] = '<i class="far fa-hand-point-right"></i>'
    properties[:scope][:title] = 'Scope'
    properties[:supplier][:icon] = '<i class="fas fa-dollar-sign"></i>'
    properties[:supplier][:title] = 'Vendor'
    properties[:manufacturer][:icon] = '<i class="far fa-building"></i>'
    properties[:manufacturer][:title] = 'Manufacturer'
    properties[:model_number][:icon] = '<i class="fas fa-hashtag"></i>'
    properties[:model_number][:title] = 'Model Number'
    properties[:zeton_po][:icon] = '<i class="fas fa-shopping-cart"></i>'
    properties[:zeton_po][:title] = 'PO Number'
    properties
  end
end
