class Instrument < ApplicationRecord
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project

  validates_presence_of :type_code, :loop
  validates :datasheet_submitted_for_approval,
    :datasheet_approved,
    :rfq_sent,
    :po_placed,
    :item_received,
    :item_inspected_and_released,
    :mounted_by_mechanical,
    :plumbed_by_mechanical,
    :cable_pulled,
    :cable_terminated_at_source,
    :cable_terminated_at_destination,
    :continuity_tested,
    :grounded_by_electrical,
    :checked_by_eng,
    inclusion: {
    in: [0, 1, 2],
    message: "%{value} is not a valid option for metrics"
  }


  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^type_/
      order("instruments.type_code #{direction}")
    when /^loop_/
      order("instruments.loop #{direction}")
    when /^scope_/
      order("instruments.scope #{direction}")
    when /^tag_/
      order("instruments.type_code #{direction}", "instruments.loop #{direction}")
    end
  }

  scope :with_type_code, -> (type_code) {
    where(type_code: type_code)
  }

  scope :with_loop, -> (loop_selected) {
    where(loop: loop_selected)
  }

  def self.metrics_attributes
    ["datasheet_submitted_for_approval",
     "datasheet_approved",
     "rfq_sent",
     "po_placed",
     "item_received",
     "item_inspected_and_released",
     "mounted_by_mechanical",
     "plumbed_by_mechanical",
     "cable_pulled",
     "cable_terminated_at_source",
     "cable_terminated_at_destination",
     "continuity_tested",
     "grounded_by_electrical",
     "checked_by_eng"
    ]
  end

  def self.is_metric_property(name)
    self.metrics_attributes.include?(name)
  end

  def self.data_attributes
    [
      "type_code",
      "loop",
      "zeton_skid_number",
      "zeton_skid_level",
      "scope",
      "mech_elec",
      "supplier",
      "manufacturer",
      "model",
      "process_connection",
      "material_of_construction",
      "item_type",
      "location",
      "dcs_io_type",
      "range",
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
    properties[:type_code][:icon] = '<i class="fas fa-bullseye"></i>'
    properties[:type_code][:title] = 'Type'
    properties[:loop][:icon] ='<i class="fas fa-hashtag"></i>'
    properties[:loop][:title] = 'Loop'
    properties[:zeton_skid_number][:icon] ='<i class="fas fa-bullseye"></i>'
    properties[:zeton_skid_number][:title] = 'Skid Number'
    properties[:zeton_skid_level][:icon] ='<i class="fas fa-bullseye"></i>'
    properties[:zeton_skid_level][:title] = 'Skid Level'
    properties[:scope][:icon] ='<i class="far fa-hand-point-right"></i>'
    properties[:scope][:title] = 'Scope'
    properties[:mech_elec][:icon] ='<i class="fas fa-list-ul"></i>'
    properties[:mech_elec][:title] = 'Installation Scope'
    properties[:supplier][:icon] ='<i class="fas fa-dollar-sign"></i>'
    properties[:supplier][:title] = 'Vendor'
    properties[:manufacturer][:icon] ='<i class="far fa-building"></i>'
    properties[:manufacturer][:title] = 'Manufacturer'
    properties[:model][:icon] ='<i class="fas fa-hashtag"></i>'
    properties[:model][:title] = 'Model Number'
    properties[:process_connection][:icon] ='<i class="fas fa-wrench"></i>'
    properties[:process_connection][:title] = 'Process Connection'
    properties[:material_of_construction][:icon] ='<i class="fas fa-certificate"></i>'
    properties[:material_of_construction][:title] = 'Material of Construction'
    properties[:item_type][:icon] ='<i class="fas fa-signal"></i>'
    properties[:item_type][:title] = 'Statistics Count'
    properties[:location][:icon] = '<i class="fas fa-bullseye"></i>'
    properties[:location][:title] = 'Installation Location'
    properties[:dcs_io_type][:icon] ='<i class="fas fa-code"></i>'
    properties[:dcs_io_type][:title] = 'DCS I/O Type'
    properties[:range][:icon] ='<i class="fas fa-sliders-h"></i>'
    properties[:range][:title] = 'Range'
    properties[:zeton_po][:icon] ='<i class="fas fa-shopping-cart"></i>'
    properties[:zeton_po][:title] = 'PO Number'
    properties
  end

  def tag
    type_code + "-" + loop
  end


end
