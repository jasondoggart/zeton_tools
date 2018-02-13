module ApplicationHelper

  def icon_select(value)
    case value
    when nil
      content_tag(:i, nil, class: 'fa fa-times-circle text-warning fa-2x')
    when 0
      content_tag(:i, nil, class: 'fa fa-times-circle text-warning fa-2x')
    when 1
      content_tag(:i, nil, class: 'fa fa-check-circle text-success fa-2x')
    when 2
      content_tag(:i, nil, class: 'fa fa-circle text-info fa-2x')
    end
  end

  def metrics_increment(value)
    if value == 0 or value == nil
      1
    elsif value == 1
      2
    else
      0
    end
  end

  def documents_metrics_increment(value)
    if value == 0 or value == nil
      1
    elsif value == 1
      0
    end
  end

  def sort_direction(current_sort)
    current_direction = (current_sort =~ /asc$/) ? 'asc' : 'desc'
    current_direction == "asc" ? 'desc' : 'asc'
  end

  def metrics_color(value)
    case value
    when 0
      "text-warning"
    when 1
      "text-success"
    when 2
      "text-info"
    end
  end
end
