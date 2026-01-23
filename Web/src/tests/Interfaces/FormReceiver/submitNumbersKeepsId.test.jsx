import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import FormReceiver from '@/components/adminComponents/formReceiver/FormReceiver.jsx';

describe('FormReceiver.jsx', () => {
  it('envía powerConsumption/x/y como number y respeta id al editar', () => {
    const onSave = vi.fn();
    render(
      <FormReceiver
        receiverToEdit={{ id: 7, name: 'R1', powerConsumption: 100, x: 1.2, y: 3.4 }}
        onSave={onSave}
        onCancel={() => {}}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'R2' } });
    const numberInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(numberInputs[0], { target: { value: '250.5' } });
    fireEvent.change(numberInputs[1], { target: { value: '10.25' } });
    fireEvent.change(numberInputs[2], { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      id: 7,
      name: 'R2',
      powerConsumption: 250.5,
      x: 10.25,
      y: 20,
    });
  });
});
