import { Button } from '@org/web-ui/components/ui/button';

export function App() {
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <Button
                onClick={() => {
                    alert('button clicked');
                }}
                // variant={'outline'}
                className='bg-blue-500'
            >
                Click me
            </Button>
        </div>
    );
}

export default App;
