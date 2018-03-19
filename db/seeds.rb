# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Create project managers
User.create(first_name: "Jason",
            last_name: "Doggart",
            email: "jdoggart@zeton.com",
            password: "password")
puts "Created Jason Doggart"
User.create(first_name: "John",
            last_name: "Onesi",
            email: "jonesi@zeton.com",
            password: "password")
puts "Created John Onesi"
User.create(first_name: "Oliver",
            last_name: "Orrell",
            email: "oorrell@zeton.com",
            password: "password")
puts "Created Oliver Orrell"
User.create(first_name: "Danielle",
            last_name: "DeSousa",
            email: "ddesousa@zeton.com",
            password: "password")
puts "Created Danielle De Sousa"

# Create projects

Project.create(
  project_number: "123-45",
  project_name: "Almost Complete Example",
  client: "A Great Client",
  project_start_date: "March 6, 2017".to_date,
  project_end_date: "April 27, 2018".to_date,
  user: User.find_by(email: "jdoggart@zeton.com")
)

puts "Created project number #{Project.last.project_number}"

Project.create(
  project_number: "234-56",
  project_name: "Halfway Done Example",
  client: "A Superb Client",
  project_start_date: "September 18, 2017".to_date,
  project_end_date: "October 23, 2018".to_date,
  user: User.find_by(email: "oorrell@zeton.com")
)

puts "Created project number #{Project.last.project_number}"

Project.create(
  project_number: "345-67",
  project_name: "Just Beginning Example",
  client: "A Fantastic Client",
  project_start_date: "February 5, 2018".to_date,
  project_end_date: "December 17, 2018".to_date,
  user: User.find_by(email: "jonesi@zeton.com")
)

puts "Created project number #{Project.last.project_number}"



# Create other project roles
User.create(first_name: "Matt",
            last_name: "Twynstra",
            email: "mtwynstra@zeton.com",
            password: "password")
puts "Created Matt Twynstra"
User.create(first_name: "Ed",
            last_name: "De Rubeis",
            email: "ederubeis@zeton.com",
            password: "password")
puts "Created Ed De Rubeis"
User.create(first_name: "John",
            last_name: "Grieve",
            email: "jgrieve@zeton.com",
            password: "password")
puts "Created John Grieve"
User.create(first_name: "Mark",
            last_name: "Pulcine",
            email: "mpulcine@zeton.com",
            password: "password")
puts "Created Mark Pulcine"
User.create(first_name: "William",
            last_name: "Beckley",
            email: "wbeckley@zeton.com",
            password: "password")
puts "Created William Beckley"
User.create(first_name: "Leisl",
            last_name: "Dukhedin-Lalla",
            email: "ldukhedin@zeton.com",
            password: "password")
puts "Created Leisl Dukhedin-Lalla"

# Create all team members
Project.all.each do |project|
  project.team_members.create(role: "Frame Fabrication Supervisor",
                              user: User.find_by(email: "mtwynstra@zeton.com"))
  project.team_members.create(role: "VP Operations",
                              user: User.find_by(email: "ldukhedin@zeton.com"))
  project.team_members.create(role: "Mechanical Supervisor",
                              user: User.find_by(email: "mpulcine@zeton.com"))
  project.team_members.create(role: "Electrical Supervisor",
                              user: User.find_by(email: "wbeckley@zeton.com"))
  project.team_members.create(role: "Mechanical Engineer",
                              user: User.find_by(email: "ederubeis@zeton.com"))
  project.team_members.create(role: "Plant Manager",
                              user: User.find_by(email: "jgrieve@zeton.com"))
  project.team_members.create(role: "Project Engineer",
                              user: User.find_by(email: "jdoggart@zeton.com"))
  project.team_members.create(role: "Project Engineer",
                              user: User.find_by(email: "jdoggart@zeton.com"))
  puts "Added #{project.team_members.count} team members to project #{project.project_number}"
end


inst_types = ["AE", "FIT", "FI", "FV",
              "LIT", "LI", "LV", "PI",
              "PIT", "PV", "PSV", "PSE",
              "SE", "TI", "TE", "TV", "TY",
              "VT", "XY", "XV", "ZSC", "ZSO",
              "FY", "PY", "LY"]
equip_types = ["V", "P", "C", "B", "X"]
skids = ["A", "B", "C", "D", "E", "F", "G"]
m_e = ["M", "E", "M/E"]
connections = ['1/2 in. 150# RF Flange', '3 in. 900# RF Flange',
               '1/2 in. FNPT', '3/4 in. Swagelok',
               '1/4 in. Swagelok', '1/4 in. MNPT']
materials = ["316SS", "304SS", "C276", "CS", "Brass", "Unobtainium"]
item_types = ["ITUBE", "IWELD", "ISCRD", "IOTHR"]
locations = ["LTUBE", "LPIPE", "EQUIP"]
io_types = ["AI", "AO", "DI", "DO", "MODBUS"] 
units = ["BARG", "Deg C", "inH2O", "BAR"]
valve_prefixes = ["HV", "CK"]
valve_codes = ["T1L", "T3L", "T6L", "T9L", "WS1", "WS3", "WS6", "WS9"]
valve_types = ["Ball", "Needle", "Check", "Butterfly"]
sizes = ["1/4 in.", "1/2 in.", "3/4 in.", "1 in.", "1.5 in.", "2 in.", "3 in."]
valve_counting_codes = ["VTUBE", "VSCRD", "VWELD", "VOTHR"]

# Create instruments and equipment for all projects 
Project.all.each do |project| 
  num_inst = rand(10..20) 
  puts "Will generate #{num_inst} instruments for project #{project.project_number}" 
  num_inst.times do 
    skid_number = skids.sample 
    skid_level = rand(1..4) 
    mech_elec = m_e.sample 
    supplier = Faker::Name.name + "'s instrument vending" 
    manufacturer = Faker::Name.name + "'s instruments"
    model = Faker::Number.number(4) + 
      '-' + Faker::Number.number(3) + 
      '-' + Faker::Number.number(5)
    process_connection = connections.sample
    material_of_construction = materials.sample
    item_type = item_types.sample
    location = locations.sample
    dcs_io_type = io_types.sample
    range = "0 - " + rand(10..1000).to_s + " " + units.sample
    project.instruments.create(type_code: inst_types[rand(inst_types.length)], 
                               loop: Faker::Number.number(4), 
                               zeton_skid_number: skid_number,
                               zeton_skid_level: skid_level,
                               scope: "Zeton",
                               mech_elec: mech_elec,
                               supplier: supplier,
                               manufacturer: manufacturer,
                               model: model,
                               process_connection: process_connection,
                               material_of_construction: material_of_construction,
                               item_type: item_type,
                               location: location,
                               dcs_io_type: dcs_io_type,
                               range: range)
  end
  puts "Generated #{project.instruments.count} instruments"

  num_equip = rand(3..7)
  puts "Will generate #{num_equip} 
  pieces of equipment for project #{project.project_number}"
  num_equip.times do
    tag = equip_types[rand(equip_types.length)]
    if tag == "V"
      equip_type = "Vessel"
    elsif tag == "P"
      equip_type = "Pump"
    elsif tag == "C"
      equip_type = "Compressor"
    elsif tag == "B"
      equip_type = "Blower"
    elsif tag == "X"
      equip_type = "Packaged Unit"
    end
    supplier = Faker::Name.name + "'s Equipment Vending"
    manufacturer = Faker::Name.name + "'s Fab Shop"
    model_number = Faker::Number.number(4) + 
      '-' + Faker::Number.number(3) + 
      '-' + Faker::Number.number(5)
    project.equipment.create(tag: tag + "-" + Faker::Number.number(3) ,
                             description: "Very Important Piece of Equipment",
                             equipment_type: equip_type,
                             scope: "Zeton",
                             manufacturer: manufacturer,
                             model_number: model_number, supplier: supplier)
  end
  puts "Generated #{project.equipment.count} pieces of equipment"

  num_valves = rand(10..20)
  puts "Will generate #{num_valves} 
    handvalves for project #{project.project_number}"
  num_valves.times do
    tag = valve_prefixes.sample + "-" + Faker::Number.number(4)
    valve_code = valve_codes.sample
    valve_type = valve_types.sample
    size = sizes.sample
    line_number = Faker::Number.number(4)
    zeton_skid_number = skids.sample
    zeton_skid_level = rand(1..4)
    scope = "Zeton"
    supplier = Faker::Name.name + "'s valve supply"
    manufacturer = Faker::Name.name + "'valve builder"
    model = Faker::Number.number(3) + 
      "-" + Faker::Number.number(4) + 
      "-" + Faker::Number.number(4)
    process_connection = connections.sample
    material_of_construction = materials.sample
    valve_counting_code = valve_counting_codes.sample
    valve_location = locations.sample
    zeton_po = "18." + Faker::Number.number(5)
    project.handvalves.create(tag: tag,
                              valve_code: valve_code,
                              valve_type: valve_type,
                              size: size,
                              line_number: line_number,
                              zeton_skid_number: zeton_skid_number,
                              zeton_skid_level: zeton_skid_level,
                              scope: scope,
                              supplier: supplier,
                              manufacturer: manufacturer,
                              model: model,
                              process_connection: process_connection,
                              material_of_construction: material_of_construction,
                              valve_counting_code: valve_counting_code,
                              valve_location: valve_location,
                              zeton_po: zeton_po)
  end
  puts "Generated #{project.handvalves.count} handvalves"

end

# Fill in project metrics
work_days = [1,2,3,4,5]
Project.all.each do |project|
  puts "Updating metrics for project #{project.project_number}"
  working_days = (project.project_start_date.to_datetime..project.project_end_date.to_datetime).to_a.
    select { |k| work_days.include?(k.wday) }
  odds = [1]
  (working_days.length).times do
    odds.push(0)
  end
  odds = odds.sort
  complete_working_days = (project.project_start_date.to_datetime..Time.now).to_a.
    select { |k| work_days.include?(k.wday) }


  #counter
  d = 0
  complete_working_days.each do |day|
    odds[d] = 1
    d += 1
    puts "Completing Metrics for day #{d} of #{working_days.length} days"
    puts "Updating Instrument Metrics for project #{project.id} of #{Project.count}"
    project.instruments.each do |inst|
      if inst.datasheet_submitted_for_approval == 0
        inst.datasheet_submitted_for_approval = odds.sample
        if inst.datasheet_submitted_for_approval == 1
          inst.datasheet_submitted_for_approval_completed_at = day
        end
      end
      if inst.datasheet_submitted_for_approval == 1 and inst.datasheet_approved == 0
        inst.datasheet_approved = odds.sample
        if inst.datasheet_approved == 1
          inst.datasheet_approved_completed_at = day
        end
      end
      if inst.datasheet_approved == 1 and inst.rfq_sent == 0
        inst.rfq_sent = odds.sample
        if inst.rfq_sent == 1
          inst.rfq_sent_completed_at = day
        end
      end
      if inst.rfq_sent == 1 and inst.po_placed == 0
        inst.po_placed = odds.sample
        if inst.po_placed == 1
          inst.po_placed_completed_at = day
          inst.zeton_po = "18." + Faker::Number.number(5)
        end
      end
      if inst.po_placed == 1 and inst.item_received == 0
        inst.item_received = odds.sample
        if inst.item_received == 1
          inst.item_received_completed_at = day
        end
      end
      if inst.item_received == 1 and inst.item_inspected_and_released == 0
        inst.item_inspected_and_released = odds.sample
        if inst.item_inspected_and_released == 1
          inst.item_inspected_and_released_completed_at = day
        end
      end
      if inst.item_inspected_and_released == 1 and inst.mounted_by_mechanical == 0
        inst.mounted_by_mechanical = odds.sample
        if inst.mounted_by_mechanical == 1
          inst.mounted_by_mechanical_completed_at = day
        end
      end
      if inst.mounted_by_mechanical == 1 and inst.plumbed_by_mechanical == 0
        inst.plumbed_by_mechanical = odds.sample
        if inst.plumbed_by_mechanical == 1
          inst.plumbed_by_mechanical_completed_at = day
        end
      end
      if inst.plumbed_by_mechanical == 1 and inst.cable_pulled == 0
        inst.cable_pulled = odds.sample
        if inst.cable_pulled == 1
          inst.cable_pulled_completed_at = day
        end
      end
      if inst.cable_pulled == 1 and inst.cable_terminated_at_source == 0
        inst.cable_terminated_at_source = odds.sample
        if inst.cable_terminated_at_source == 1
          inst.cable_terminated_at_source_completed_at = day
        end
      end
      if inst.cable_terminated_at_source == 1 and inst.cable_terminated_at_destination == 0
        inst.cable_terminated_at_destination = odds.sample
        if inst.cable_terminated_at_destination == 1
          inst.cable_terminated_at_destination_completed_at = day
        end
      end
      if inst.cable_terminated_at_destination == 1 and inst.continuity_tested == 0
        inst.continuity_tested = odds.sample
        if inst.continuity_tested == 1
          inst.continuity_tested_completed_at = day
        end
      end
      if inst.continuity_tested == 1 and inst.grounded_by_electrical == 0
        inst.grounded_by_electrical = odds.sample
        if inst.grounded_by_electrical == 1
          inst.grounded_by_electrical_completed_at = day
        end
      end
      if inst.grounded_by_electrical == 1 and inst.checked_by_eng == 0
        inst.checked_by_eng = odds.sample
        if inst.checked_by_eng == 1
          inst.checked_by_eng_completed_at = day
        end
      end
      inst.save
    end
    project.equipment.each do |equip|
      if equip.datasheet_complete == 0
        equip.datasheet_complete = odds.sample
        if equip.datasheet_complete == 1
          equip.datasheet_complete_completed_at = day
        end
      end
      if equip.datasheet_complete == 1 and equip.datasheet_released == 0
        equip.datasheet_released = odds.sample
        if equip.datasheet_released == 1
          equip.datasheet_released_completed_at = day
        end
      end
      if equip.datasheet_released == 1 and equip.rfq_sent == 0
        equip.rfq_sent = odds.sample
        if equip.rfq_sent == 1
          equip.rfq_sent_completed_at = day
        end
      end
      if equip.rfq_sent == 1 and equip.po_placed == 0
        equip.po_placed = odds.sample
        if equip.po_placed == 1
          equip.zeton_po = "18." + Faker::Number.number(5)
          equip.po_placed_completed_at = day
        end
      end
      if equip.po_placed == 1 and equip.drawing_for_approval_received == 0
        equip.drawing_for_approval_received = odds.sample
        if equip.drawing_for_approval_received == 1
          equip.drawing_for_approval_received_completed_at = day
        end
      end
      if equip.drawing_for_approval_received == 1 and equip.drawing_for_approval_marked_up == 0
        equip.drawing_for_approval_marked_up = odds.sample
        if equip.drawing_for_approval_marked_up == 1
          equip.drawing_for_approval_marked_up_completed_at = day
        end
      end
      if equip.drawing_for_approval_marked_up == 1 and equip.drawing_for_approval_sent_to_client == 0
        equip.drawing_for_approval_sent_to_client = odds.sample
        if equip.drawing_for_approval_sent_to_client == 1
          equip.drawing_for_approval_sent_to_client_completed_at = day
        end
      end
      if equip.drawing_for_approval_sent_to_client == 1 and equip.drawing_for_approval_released_for_construction == 0
        equip.drawing_for_approval_released_for_construction = odds.sample
        if equip.drawing_for_approval_released_for_construction == 1
          equip.drawing_for_approval_released_for_construction_completed_at = day
        end
      end
      if equip.drawing_for_approval_released_for_construction == 1 and equip.item_received_at_zeton == 0
        equip.item_received_at_zeton = odds.sample
        if equip.item_received_at_zeton == 1
          equip.item_received_at_zeton_completed_at = day
        end
      end
      if equip.item_received_at_zeton == 1 and equip.item_inspected_and_released == 0
        equip.item_inspected_and_released = odds.sample
        if equip.item_inspected_and_released == 1
          equip.item_inspected_and_released_completed_at = day
        end
      end
      if equip.item_inspected_and_released == 1 and equip.item_installed_by_mech == 0
        equip.item_installed_by_mech = odds.sample
        if equip.item_installed_by_mech == 1
          equip.item_installed_by_mech_completed_at = day
        end
      end
      if equip.item_installed_by_mech == 1 and equip.item_grounded_by_elec == 0
        equip.item_grounded_by_elec = odds.sample
        if equip.item_grounded_by_elec == 1
          equip.item_grounded_by_elec_completed_at = day
        end
      end
      if equip.item_grounded_by_elec ==1 and equip.item_inspected_by_eng == 0
        equip.item_inspected_by_eng = odds.sample
        if equip.item_inspected_by_eng == 1
          equip.item_inspected_by_eng_completed_at = day
        end
      end
      equip.save
    end
    project.handvalves.each do |valve|
      if valve.valve_description_complete == 0
        valve.valve_description_complete = odds.sample
        if valve.valve_description_complete == 1
          valve.valve_description_complete_completed_at = day
        end
      end
      if valve.valve_description_complete == 1 and valve.valve_description_approved == 0
        valve.valve_description_approved = odds.sample
        if valve.valve_description_approved == 1
          valve.valve_description_approved_completed_at = day
        end
      end
      if valve.valve_description_approved == 1 and valve.po_placed == 0
        valve.po_placed = odds.sample
        if valve.po_placed == 1
          valve.po_placed_completed_at = day
          valve.zeton_po = "18." + Faker::Number.number(5)
        end
      end
      if valve.po_placed == 1 and valve.item_received == 0
        valve.item_received = odds.sample
        if valve.item_received == 1
          valve.item_received_completed_at = day
        end
      end
      if valve.item_received == 1 and valve.item_inspected_and_released = 0
        valve.item_inspected_and_released = odds.sample
        if valve.item_inspected_and_released == 1
          valve.item_inspected_and_released_completed_at = day
        end
      end
      if valve.item_inspected_and_released == 1 and valve.item_mounted == 0
        valve.item_mounted = odds.sample
        if valve.item_mounted == 1
          valve.item_mounted_completed_at = day
        end
      end
      if valve.item_mounted == 1 and valve.item_plumbed == 0
        valve.item_plumbed = odds.sample
        if valve.item_plumbed == 1
          valve.item_plumbed_completed_at = day
        end
      end
      if valve.item_plumbed == 1 and valve.item_checked_by_eng == 0
        valve.item_checked_by_eng = odds.sample
        if valve.item_checked_by_eng == 1
          valve.item_checked_by_eng_completed_at = day
        end
      end
      valve.save
    end
  end

end


# Add project RFI's
areas = ["A - Process", "B - BOM", "C - Controls",
         "D - Drawings", "E - Electrical", "F - Databooks",
         "G - General", "H - Project Management",
         "I - Instruments", "L - Piping", "M - Major Equipment", "O - Safety"]

Project.all.each do |project|
  puts "creating rfis for project #{project.id} of #{Project.count}"
  num_rfis = rand(15..75)
  puts "will create #{num_rfis} for project #{project.id}"
  num_rfis.times do
    area = areas.sample
    zeton_clarification = Faker::Lorem.paragraph(3)
    project.information_requests.create(
                             zeton_clarification: zeton_clarification,
                             area: area
    )
    # add instrument associations
    num_assoc_inst = rand(0..3)
    num_assoc_inst.times do
      project.information_requests.last.instruments << project.instruments.sample
    end

    # add equipmebt associations
    num_assoc_equip = rand(0..2)
    num_assoc_equip.times do
      project.information_requests.last.equipment << project.equipment.sample
    end

    # add handvalve associations
    num_assoc_hv = rand(0..3)
    num_assoc_hv.times do
      project.information_requests.last.handvalves << project.handvalves.sample
    end
  end
end

# add RFI responses
organizations = ["Client", "Zeton"]
Project.all.each do |project|
  puts "creating rfi responses for project #{project.id} of #{Project.count}"
  project.information_requests.each do |rfi|
    num_responses = rand(0..3)
    num_responses.times do
      organization = organizations.sample
      responder = Faker::Name.name
      response_text = Faker::Lorem.paragraph(2)
      rfi.rfi_responses.create(organization: organization,
                               responder: responder,
                               response: response_text)
    end
  end
end

# Add project Action Items

sent_by_options = ["Email", "Phone", "Internal Meeting"]

Project.all.each do |project|
  puts "creating rfis for project #{project.id} of #{Project.count}"
  num_action_items = rand(5..75)
  puts "will create #{num_action_items} for project #{project.id}"
  num_action_items.times do
    priority = rand(1..3)
    area = areas.sample
    title = Faker::Lorem.paragraph(1)
    target_date = rand(3..200).days.from_now
    status = rand(0..1)
    creator = project.user
    assigned_to = project.team_members.sample.user
    if status == 1
      completion_date = rand(1..29).days.ago
    else
      completion_date = nil
    end
    sent_by = sent_by_options.sample
    description = Faker::Lorem.paragraph(5)
    project.action_items.create(priority: priority,
                                area: area,
                                title: title,
                                target_date: target_date,
                                completion_date: completion_date,
                                sent_by: sent_by,
                                description: description,
                                status: status,
                                creator: creator,
                                assigned_to: assigned_to)
    # add instrument associations
    num_assoc_inst = rand(0..3)
    num_assoc_inst.times do
      project.action_items.last.instruments << project.instruments.sample
    end

    # add equipment associations
    num_assoc_equip = rand(0..3)
    num_assoc_equip.times do
      project.action_items.last.equipment << project.equipment.sample
    end

    # add handvalve associations
    num_assoc_hv = rand(0..3)
    num_assoc_hv.times do
      project.action_items.last.handvalves << project.handvalves.sample
    end

  end
end
